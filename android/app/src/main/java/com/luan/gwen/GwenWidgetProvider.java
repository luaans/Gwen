package com.luan.gwen;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class GwenWidgetProvider extends AppWidgetProvider {
    public static final String ACTION_REFRESH = "com.luan.gwen.WIDGET_REFRESH";

    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, manager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if (ACTION_REFRESH.equals(intent.getAction())) {
            AppWidgetManager manager = AppWidgetManager.getInstance(context);
            int[] ids = manager.getAppWidgetIds(new ComponentName(context, GwenWidgetProvider.class));
            onUpdate(context, manager, ids);
        }
    }

    static void updateAll(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] ids = manager.getAppWidgetIds(new ComponentName(context, GwenWidgetProvider.class));
        for (int id : ids) {
            updateAppWidget(context, manager, id);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager manager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_gwen);

        Intent openIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(WidgetPrefs.getBaseUrl(context) + "/dashboard"));
        PendingIntent openPending = PendingIntent.getActivity(
                context,
                appWidgetId,
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_root, openPending);

        Intent refreshIntent = new Intent(context, GwenWidgetProvider.class);
        refreshIntent.setAction(ACTION_REFRESH);
        PendingIntent refreshPending = PendingIntent.getBroadcast(
                context,
                appWidgetId + 1000,
                refreshIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_refresh, refreshPending);

        Intent configIntent = new Intent(context, WidgetConfigActivity.class);
        PendingIntent configPending = PendingIntent.getActivity(
                context,
                appWidgetId + 2000,
                configIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_settings, configPending);

        if (!WidgetPrefs.isConfigured(context)) {
            views.setTextViewText(R.id.widget_mood, "Toque no ⚙ para conectar");
            views.setTextViewText(R.id.widget_reminder, "Cole o token de Configurações → Widget Android");
            views.setTextViewText(R.id.widget_meta, "não conectado");
            manager.updateAppWidget(appWidgetId, views);
            return;
        }

        views.setTextViewText(R.id.widget_mood, "Atualizando…");
        views.setTextViewText(R.id.widget_reminder, "");
        views.setTextViewText(R.id.widget_meta, "");
        manager.updateAppWidget(appWidgetId, views);

        EXECUTOR.execute(() -> {
            WidgetSnapshot snapshot = fetchSnapshot(context);
            MAIN.post(() -> applySnapshot(context, manager, appWidgetId, snapshot));
        });
    }

    private static void applySnapshot(
            Context context,
            AppWidgetManager manager,
            int appWidgetId,
            WidgetSnapshot snapshot
    ) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_gwen);

        Intent openIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(WidgetPrefs.getBaseUrl(context) + "/dashboard"));
        PendingIntent openPending = PendingIntent.getActivity(
                context,
                appWidgetId,
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_root, openPending);

        Intent refreshIntent = new Intent(context, GwenWidgetProvider.class);
        refreshIntent.setAction(ACTION_REFRESH);
        PendingIntent refreshPending = PendingIntent.getBroadcast(
                context,
                appWidgetId + 1000,
                refreshIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_refresh, refreshPending);

        Intent configIntent = new Intent(context, WidgetConfigActivity.class);
        PendingIntent configPending = PendingIntent.getActivity(
                context,
                appWidgetId + 2000,
                configIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_settings, configPending);

        if (snapshot.error != null) {
            views.setTextViewText(R.id.widget_mood, "Não consegui atualizar");
            views.setTextViewText(R.id.widget_reminder, snapshot.error);
            views.setTextViewText(R.id.widget_meta, "tente de novo");
        } else {
            views.setTextViewText(R.id.widget_mood, snapshot.moodLine);
            views.setTextViewText(R.id.widget_reminder, snapshot.reminderLine);
            views.setTextViewText(R.id.widget_meta, snapshot.metaLine);
        }

        manager.updateAppWidget(appWidgetId, views);
    }

    private static WidgetSnapshot fetchSnapshot(Context context) {
        WidgetSnapshot snapshot = new WidgetSnapshot();
        HttpURLConnection connection = null;
        try {
            String base = WidgetPrefs.getBaseUrl(context).replaceAll("/+$", "");
            URL url = new URL(base + "/api/widget");
            connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(12000);
            connection.setReadTimeout(12000);
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Authorization", "Bearer " + WidgetPrefs.getToken(context));
            connection.setRequestProperty("Accept", "application/json");

            int code = connection.getResponseCode();
            InputStream stream = code >= 200 && code < 300
                    ? connection.getInputStream()
                    : connection.getErrorStream();
            String body = readStream(stream);

            if (code == 401) {
                snapshot.error = "Token inválido — gere outro em Configurações";
                return snapshot;
            }
            if (code < 200 || code >= 300) {
                snapshot.error = "Erro " + code;
                return snapshot;
            }

            JSONObject json = new JSONObject(body);
            if (json.isNull("mood")) {
                snapshot.moodLine = "Humor: ainda sem check-in";
            } else {
                JSONObject mood = json.getJSONObject("mood");
                String label = mood.optString("label", "—");
                snapshot.moodLine = "Humor: " + capitalize(label);
            }

            int open = json.optInt("openReminders", 0);
            if (json.isNull("reminder")) {
                snapshot.reminderLine = "Nenhuma lembrança aberta";
            } else {
                JSONObject reminder = json.getJSONObject("reminder");
                String title = reminder.optString("title", "Lembrança");
                String person = reminder.optString("personName", "");
                if (person != null && !person.isEmpty()) {
                    snapshot.reminderLine = title + " · " + person;
                } else {
                    snapshot.reminderLine = title;
                }
            }

            snapshot.metaLine = open + (open == 1 ? " aberta" : " abertas");
            return snapshot;
        } catch (Exception e) {
            snapshot.error = e.getMessage() != null ? e.getMessage() : "Falha de rede";
            return snapshot;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private static String readStream(InputStream stream) throws Exception {
        if (stream == null) return "";
        BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8));
        StringBuilder builder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            builder.append(line);
        }
        reader.close();
        return builder.toString();
    }

    private static String capitalize(String value) {
        if (value == null || value.isEmpty()) return "—";
        return Character.toUpperCase(value.charAt(0)) + value.substring(1);
    }

    private static class WidgetSnapshot {
        String moodLine = "";
        String reminderLine = "";
        String metaLine = "";
        String error;
    }
}

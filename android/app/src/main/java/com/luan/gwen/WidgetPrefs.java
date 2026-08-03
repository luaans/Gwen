package com.luan.gwen;

import android.content.Context;
import android.content.SharedPreferences;

final class WidgetPrefs {
    private static final String PREFS = "gwen_widget_prefs";
    private static final String KEY_BASE_URL = "base_url";
    private static final String KEY_TOKEN = "token";

    private WidgetPrefs() {}

    static SharedPreferences prefs(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static String getBaseUrl(Context context) {
        return prefs(context).getString(KEY_BASE_URL, "https://gwen-plum.vercel.app");
    }

    static String getToken(Context context) {
        return prefs(context).getString(KEY_TOKEN, "");
    }

    static void save(Context context, String baseUrl, String token) {
        prefs(context)
                .edit()
                .putString(KEY_BASE_URL, baseUrl)
                .putString(KEY_TOKEN, token)
                .apply();
    }

    static boolean isConfigured(Context context) {
        String token = getToken(context);
        return token != null && !token.trim().isEmpty();
    }
}

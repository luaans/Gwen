package com.luan.gwen;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class WidgetConfigActivity extends Activity {
    private int appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setResult(RESULT_CANCELED);
        setContentView(R.layout.activity_widget_config);

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null) {
            appWidgetId = extras.getInt(
                    AppWidgetManager.EXTRA_APPWIDGET_ID,
                    AppWidgetManager.INVALID_APPWIDGET_ID
            );
        }

        EditText baseUrlInput = findViewById(R.id.input_base_url);
        EditText tokenInput = findViewById(R.id.input_token);
        Button saveButton = findViewById(R.id.btn_save);

        baseUrlInput.setText(WidgetPrefs.getBaseUrl(this));
        tokenInput.setText(WidgetPrefs.getToken(this));

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String baseUrl = baseUrlInput.getText().toString().trim();
                String token = tokenInput.getText().toString().trim();

                if (baseUrl.isEmpty()) {
                    Toast.makeText(WidgetConfigActivity.this, "Informe a URL da Gwen", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (token.isEmpty()) {
                    Toast.makeText(WidgetConfigActivity.this, "Cole o token das Configurações", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (baseUrl.endsWith("/")) {
                    baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
                }

                WidgetPrefs.save(WidgetConfigActivity.this, baseUrl, token);

                if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
                    AppWidgetManager manager = AppWidgetManager.getInstance(WidgetConfigActivity.this);
                    GwenWidgetProvider.updateAppWidget(WidgetConfigActivity.this, manager, appWidgetId);

                    Intent result = new Intent();
                    result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
                    setResult(RESULT_OK, result);
                } else {
                    GwenWidgetProvider.updateAll(WidgetConfigActivity.this);
                    setResult(RESULT_OK);
                }

                Toast.makeText(WidgetConfigActivity.this, "Widget conectado", Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }
}

package com.yourdomain.yourapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = (WebView) findViewById(R.id.webview);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                System.out.println("Page loaded: " + url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                System.err.println("Error loading page: " + description + " URL: " + failingUrl);
            }
        });
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true); // Enable DOM storage API
        webView.getSettings().setUseWideViewPort(true); // Enable viewport meta tag support
        webView.getSettings().setLoadWithOverviewMode(true); // Load the WebView completely zoomed out

        String webAppUrl = "file:///android_asset/webapp/views/index.html"; 
        webView.loadUrl(webAppUrl);

        // Log for successful WebView initialization
        System.out.println("WebView initialized and loaded URL: " + webAppUrl);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
package com.wooyongbin.lifeclock;

import android.os.Build;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

/**
 * Enables high refresh rate (up to 120Hz) and GPU-friendly WebView settings
 * so the life-clock RAF loop can paint smoothly on high-refresh devices.
 */
public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);

        // Prefer the highest refresh mode at the current display resolution.
        requestHighRefreshRate(window);

        // WebView / JS paint path: hardware layer + no forced dark surprises.
        configureWebViewForSmoothPaint();
    }

    private void requestHighRefreshRate(Window window) {
        try {
            Display display = getWindowManager().getDefaultDisplay();
            Display.Mode current = display.getMode();
            Display.Mode[] modes = display.getSupportedModes();

            Display.Mode best = null;
            float bestRate = 0f;

            // Prefer same physical resolution as the active mode (avoids scaling jank).
            for (Display.Mode mode : modes) {
                boolean sameSize =
                        mode.getPhysicalWidth() == current.getPhysicalWidth()
                                && mode.getPhysicalHeight() == current.getPhysicalHeight();
                if (!sameSize) {
                    continue;
                }
                if (mode.getRefreshRate() > bestRate) {
                    bestRate = mode.getRefreshRate();
                    best = mode;
                }
            }

            // Fallback: any mode with the highest refresh rate.
            if (best == null) {
                for (Display.Mode mode : modes) {
                    if (mode.getRefreshRate() > bestRate) {
                        bestRate = mode.getRefreshRate();
                        best = mode;
                    }
                }
            }

            WindowManager.LayoutParams lp = window.getAttributes();
            if (best != null) {
                lp.preferredDisplayModeId = best.getModeId();
            }
            // API 30+: soft hint toward 120Hz when the panel supports it.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                lp.preferredRefreshRate = Math.max(bestRate, 120f);
            }
            window.setAttributes(lp);

            // API 35+: keep high refresh even when the system tries to save power.
            if (Build.VERSION.SDK_INT >= 35) {
                try {
                    window.getClass()
                            .getMethod("setFrameRatePowerSavingsBalanced", boolean.class)
                            .invoke(window, false);
                } catch (Throwable ignored) {
                    // Optional API; ignore if unavailable.
                }
            }
        } catch (Throwable ignored) {
            // Display mode APIs vary by OEM; never crash onCreate.
        }
    }

    private void configureWebViewForSmoothPaint() {
        try {
            if (getBridge() == null || getBridge().getWebView() == null) {
                return;
            }
            WebView webView = getBridge().getWebView();
            // Continuous SVG dashoffset + text updates benefit from a hardware layer.
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
            @SuppressWarnings("deprecation")
            WebSettings settings = webView.getSettings();
            settings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        } catch (Throwable ignored) {
            // Bridge may not be ready on some Capacitor versions; safe no-op.
        }
    }
}

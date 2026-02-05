import { useEffect } from "react";

type SeleneWidgetOptions = {
    apiKey: string;
    widget?: string;
};

export function useSeleneWidget(enabled: boolean, { apiKey, widget = "support" }: SeleneWidgetOptions) {
    useEffect(() => {
        if (!enabled) return;

        const styleId = "selene-integrator-theme";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = `
        :root {
          --selene-integrator-primary: #2563eb;
          --selene-integrator-secondary: #1e40af;
          --selene-integrator-bg: #ffffff;
          --selene-integrator-text: #020617;
          --selene-integrator-label: #1e40af;
          --selene-integrator-input-bg: #f8fafc;
          --selene-integrator-input-text: #020617;
          --selene-integrator-placeholder: #3b82f6;
          --selene-integrator-input-border: #93c5fd;
        }
      `;
            document.head.appendChild(style);
        }

        const containerId = "selene-widget";
        if (!document.getElementById(containerId)) {
            const div = document.createElement("div");
            div.id = containerId;
            div.dataset.widget = widget;
            div.dataset.apiKey = apiKey;
            document.body.appendChild(div);
        }

        const scriptId = "selene-universal-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "http://localhost:9014/component/selene-universal.js";
            script.async = true;
            document.body.appendChild(script);
        }

        return () => {
            const container = document.getElementById(containerId);
            if (container) container.remove();

            const style = document.getElementById(styleId);
            if (style) style.remove();
        };
    }, [enabled, apiKey, widget]);
}
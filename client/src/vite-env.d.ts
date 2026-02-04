/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_API_BASE_WS: string
    readonly VITE_IRIS_BASE_URL: string
    readonly VITE_ENABLE_FLOATING_MONITOR: string
    readonly VITE_GOOGLE_CHAT_WEBHOOK_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

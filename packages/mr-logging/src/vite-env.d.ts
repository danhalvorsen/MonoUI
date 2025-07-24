/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OTEL_EXPORTER_OTLP_ENDPOINT: string;
  readonly VITE_SERVICE_NAME: string;
  readonly VITE_SEQ_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

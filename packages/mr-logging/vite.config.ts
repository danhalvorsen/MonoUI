import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  define: {
    'import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT': JSON.stringify(process.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317'),
    'import.meta.env.VITE_SERVICE_NAME': JSON.stringify(process.env.VITE_SERVICE_NAME || 'mr-service'),
    'import.meta.env.VITE_SEQ_API_KEY': JSON.stringify(process.env.VITE_SEQ_API_KEY || ''),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MrLogging",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: [
        "@opentelemetry/api",
        "@opentelemetry/sdk-logs",
        "@opentelemetry/resources",
        "@opentelemetry/exporter-logs-otlp-grpc"
      ],
      output: {
        globals: {
          "@opentelemetry/api": "opentelemetryApi",
          "@opentelemetry/sdk-logs": "opentelemetrySdkLogs",
          "@opentelemetry/resources": "opentelemetryResources",
          "@opentelemetry/exporter-logs-otlp-grpc": "opentelemetryLogsOtlpGrpc"
        }
      }
    },
    sourcemap: true
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./vitest.setup.ts"
  }
});

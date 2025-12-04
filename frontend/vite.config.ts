import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: [
      "@aws-sdk/client-cognito-identity",
      "@aws-sdk/client-cognito-identity-provider",
    ],
    exclude: ["@aws-sdk/endpoint-cache"],
  },

  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },

  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
});

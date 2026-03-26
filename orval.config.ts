import { defineConfig } from "orval";

export default defineConfig({
  birdxplorer_api: {
    input: "https://dev.api-birdxplorer.code4japan.org/openapi.json",
    output: {
      clean: true,
      prettier: true,
      mode: "split",
      schemas: "app/generated/api/schemas",
      target: "app/generated/api/client.ts",
      client: "fetch",
      httpClient: "fetch",
      baseUrl: "https://dev.api-birdxplorer.code4japan.org",
      urlEncodeParameters: true,
      mock: {
        type: "msw",
        useExamples: true,
        locale: "ja",
      },
    },
  },
  birdxplorer_zod: {
    input: "https://dev.api-birdxplorer.code4japan.org/openapi.json",
    output: {
      clean: true,
      prettier: true,
      target: "app/generated/api/zod/schema.ts",
      client: "zod",
    },
  },
});

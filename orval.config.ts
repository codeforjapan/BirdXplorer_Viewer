import { defineConfig } from "orval";

export default defineConfig({
  birdxplorer: {
    input: "https://birdxplorer.onrender.com/openapi.json",
    output: {
      clean: true,
      prettier: true,
      mode: "split",
      schemas: "app/generated/api/schemas",
      target: "app/generated/api/client.ts",
      client: "react-query",
      httpClient: "fetch",
      baseUrl: "https://birdxplorer.onrender.com",
      urlEncodeParameters: true,
      mock: {
        type: "msw",
        useExamples: true,
      },
      override: {
        operations: {
          get_notes_api_v1_data_notes_get: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "offset",
            },
          },
          get_posts_api_v1_data_posts_get: {
            query: {
              useInfinite: true,
              useInfiniteQueryParam: "offset",
            },
          },
        },
      },
    },
  },
});

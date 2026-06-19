import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import type { GraphApiError } from "./api";
import { GraphState } from "./GraphState";

describe("GraphState", () => {
  it("renders children on success", async () => {
    const screen = await render(
      <GraphState status="success">
        <div>success-content</div>
      </GraphState>,
    );

    expect(screen.getByText("success-content")).toBeTruthy();
  });

  it("renders loading state", async () => {
    const screen = await render(
      <GraphState status="loading">
        <div>success-content</div>
      </GraphState>,
    );

    const loader = screen.container.querySelector(".mantine-Loader-root");
    expect(loader).toBeTruthy();
  });

  it("renders empty message", async () => {
    const screen = await render(
      <GraphState status="empty">
        <div>success-content</div>
      </GraphState>,
    );

    expect(screen.getByText("表示できるデータがありません")).toBeTruthy();
  });

  it("renders error message", async () => {
    const error: GraphApiError = {
      kind: "server",
      message: "server error",
    };

    const screen = await render(
      <GraphState error={error} status="error">
        <div>success-content</div>
      </GraphState>,
    );

    expect(screen.getByText("server error")).toBeTruthy();
  });
});

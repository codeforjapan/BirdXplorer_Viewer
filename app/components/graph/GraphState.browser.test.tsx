import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import type { GraphApiError } from "./api";
import { GraphState } from "./GraphState";

describe("GraphState", () => {
  it("renders children on success", () => {
    const screen = render(
      <GraphState status="success">
        <div>success-content</div>
      </GraphState>
    );

    expect(screen.getByText("success-content")).toBeTruthy();
  });

  it("renders loading state", () => {
    const screen = render(
      <GraphState status="loading">
        <div>success-content</div>
      </GraphState>
    );

    const skeleton = screen.container.querySelector(".mantine-Skeleton-root");
    expect(skeleton).toBeTruthy();
  });

  it("renders empty message", () => {
    const screen = render(
      <GraphState status="empty">
        <div>success-content</div>
      </GraphState>
    );

    expect(screen.getByText("表示できるデータがありません")).toBeTruthy();
  });

  it("renders error message", () => {
    const error: GraphApiError = {
      kind: "server",
      message: "server error",
    };

    const screen = render(
      <GraphState error={error} status="error">
        <div>success-content</div>
      </GraphState>
    );

    expect(screen.getByText("server error")).toBeTruthy();
  });
});

import { userEvent } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";

import { render } from "../../../test/test-react";
import { GraphErrorState } from "./GraphErrorState";

describe("GraphErrorState", () => {
  it("renders error message and retry button", () => {
    const onRetry = vi.fn();
    const screen = render(
      <GraphErrorState
        error={{ kind: "network", message: "network error" }}
        onRetry={onRetry}
      />
    );

    expect(screen.getByText("network error")).toBeTruthy();
    expect(screen.getByText("再試行")).toBeTruthy();
  });

  it("hides retry button when onRetry is absent", () => {
    const screen = render(
      <GraphErrorState error={{ kind: "server", message: "server error" }} />
    );

    expect(screen.getByText("server error")).toBeTruthy();
    expect(screen.getByText("再試行").query()).toBeNull();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = vi.fn();
    const screen = render(
      <GraphErrorState
        error={{ kind: "network", message: "network error" }}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByText("再試行");
    await userEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("calls onRetry multiple times on multiple clicks", async () => {
    const onRetry = vi.fn();
    const screen = render(
      <GraphErrorState
        error={{ kind: "network", message: "network error" }}
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByText("再試行");
    await userEvent.click(retryButton);
    await userEvent.click(retryButton);
    await userEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(3);
  });

  it("displays error issues when provided", () => {
    const screen = render(
      <GraphErrorState
        error={{
          kind: "validation",
          message: "Validation failed",
          issues: ["Invalid period", "Missing status"],
        }}
      />
    );

    expect(screen.getByText("Validation failed")).toBeTruthy();
    expect(screen.getByText("Invalid period")).toBeTruthy();
    expect(screen.getByText("Missing status")).toBeTruthy();
  });

  it("displays at most 3 issues", () => {
    const screen = render(
      <GraphErrorState
        error={{
          kind: "validation",
          message: "Validation failed",
          issues: ["Issue 1", "Issue 2", "Issue 3", "Issue 4", "Issue 5"],
        }}
      />
    );

    expect(screen.getByText("Issue 1")).toBeTruthy();
    expect(screen.getByText("Issue 2")).toBeTruthy();
    expect(screen.getByText("Issue 3")).toBeTruthy();
    // 4件目以降は表示されない
    expect(screen.getByText("Issue 4").query()).toBeNull();
    expect(screen.getByText("Issue 5").query()).toBeNull();
  });

  it("does not render issues section when issues is empty", () => {
    const screen = render(
      <GraphErrorState
        error={{
          kind: "server",
          message: "Server error",
          issues: [],
        }}
      />
    );

    expect(screen.getByText("Server error")).toBeTruthy();
    // issues が空の場合、Stack コンポーネントが追加でレンダリングされないことを確認
    const textElements = screen.container.querySelectorAll('[class*="mantine-Text-root"]');
    // エラーメッセージの1つだけがあるはず
    expect(textElements.length).toBe(1);
  });

  it("does not render issues section when issues is undefined", () => {
    const screen = render(
      <GraphErrorState
        error={{
          kind: "server",
          message: "Server error",
        }}
      />
    );

    expect(screen.getByText("Server error")).toBeTruthy();
    const textElements = screen.container.querySelectorAll('[class*="mantine-Text-root"]');
    expect(textElements.length).toBe(1);
  });
});

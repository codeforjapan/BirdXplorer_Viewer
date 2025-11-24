import React from "react";
import { Anchor, Card } from "@mantine/core";
import { Link } from "react-router";

export type BreadCrumbItem = {
  /**
   * 表示テキスト
   */
  label: string;
  /**
   * リンク先のパス (最後のアイテムの場合は undefined)
   */
  href?: string;
};

type BreadCrumbProps = {
  /**
   * パンくずリストのアイテム
   * 最後のアイテムは現在のページを表す
   */
  items: BreadCrumbItem[];
};

export const BreadCrumb = ({ items }: BreadCrumbProps) => {
  return (
    <Card
      className="border-[#515151]"
      data-testid="breadcrumb-card"
      padding="md"
      radius="md"
      style={{ backgroundColor: "#171717", display: "inline-block" }}
      withBorder
    >
      <nav
        aria-label="breadcrumb"
        style={{
          display: "inline-flex",
          flexWrap: "nowrap",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "12px",
                    lineHeight: 1,
                  }}
                >
                  &gt;
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    color: "#FFFFFF",
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Anchor
                  component={Link}
                  style={{
                    color: "#1D9BF0",
                    fontSize: "12px",
                    lineHeight: 1,
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                  to={item.href}
                  underline="never"
                >
                  {item.label}
                </Anchor>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </Card>
  );
};

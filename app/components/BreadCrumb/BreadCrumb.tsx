import { Anchor, Breadcrumbs, Card, Text } from "@mantine/core";
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
      data-testid="breadcrumb-card"
      radius="md"
      style={{
        backgroundColor: "var(--color-gray-1)",
        padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
        borderColor: "var(--color-gray-2)",
      }}
      withBorder
    >
      <Breadcrumbs
        separator=">"
        separatorMargin="s"
        styles={{
          separator: {
            color: "#FFFFFF",
            fontSize: "12px",
            lineHeight: 1,
          },
          breadcrumb: {
            fontSize: "12px",
            lineHeight: 1,
            fontWeight: 400,
            whiteSpace: "nowrap",
          },
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast || !item.href) {
            return (
              <Text
                aria-current={isLast ? "page" : undefined}
                c="#FFFFFF"
                component="span"
                key={index}
              >
                {item.label}
              </Text>
            );
          }

          return (
            <Anchor
              component={Link}
              key={index}
              styles={{
                root: {
                  color: "#1D9BF0",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
              }}
              to={item.href}
              underline="never"
            >
              {item.label}
            </Anchor>
          );
        })}
      </Breadcrumbs>
    </Card>
  );
};

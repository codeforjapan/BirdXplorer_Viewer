import { Anchor, Breadcrumbs, Card } from "@mantine/core";
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
    <Card padding="md" radius="md" withBorder>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast || !item.href) {
            return (
              <span aria-current={isLast ? "page" : undefined} key={index}>
                {item.label}
              </span>
            );
          }

          return (
            <Anchor component={Link} key={index} to={item.href}>
              {item.label}
            </Anchor>
          );
        })}
      </Breadcrumbs>
    </Card>
  );
};

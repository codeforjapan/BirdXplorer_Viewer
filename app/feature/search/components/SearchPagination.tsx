import type { GroupProps } from "@mantine/core";
import { ActionIcon, Group, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { useMemo } from "react";
import { getQuery, withQuery } from "ufo";
import type { z } from "zod";

import Fa6SolidAngleLeft from "~icons/fa6-solid/angle-left";
import Fa6SolidAngleRight from "~icons/fa6-solid/angle-right";

import type { PaginationMeta } from "../../../generated/api/schemas/paginationMeta";
import { buildPaginationMeta } from "../pagination";
import type { noteSearchParamSchema } from "../validation";

type PaginationProps = {
  meta: PaginationMeta;
  currentQuery: z.infer<typeof noteSearchParamSchema>;
  /**
   * 検索結果として表示している現在のページに表示しているデータの件数
   */
  visibleItemCount: number;
} & GroupProps;

export const SearchPagination = ({
  currentQuery,
  meta,
  visibleItemCount,
  ...groupProps
}: PaginationProps) => {
  const pagination = buildPaginationMeta(meta, currentQuery);

  const pageFirstItemIndex = currentQuery.offset + 1;
  const totalDisplayedItems = currentQuery.offset + visibleItemCount;

  const prevTo = useMemo(
    () => (pagination?.prev ? withQuery("/", getQuery(pagination.prev)) : null),
    [pagination?.prev],
  );
  const nextTo = useMemo(
    () => (pagination?.next ? withQuery("/", getQuery(pagination.next)) : null),
    [pagination?.next],
  );

  return (
    <Group {...groupProps}>
      <Text>
        {pageFirstItemIndex} ～ {totalDisplayedItems} 件目を表示中
      </Text>
      {prevTo ? (
        <ActionIcon
          aria-label="次のページへ移動する"
          color="pink"
          component={Link}
          to={prevTo}
          variant="light"
        >
          <Fa6SolidAngleLeft />
        </ActionIcon>
      ) : (
        <ActionIcon color="pink" disabled variant="light">
          <Fa6SolidAngleLeft />
        </ActionIcon>
      )}
      {nextTo ? (
        <ActionIcon
          aria-label="前のページへ移動する"
          color="pink"
          component={Link}
          to={nextTo}
          variant="light"
        >
          <Fa6SolidAngleRight />
        </ActionIcon>
      ) : (
        <ActionIcon color="pink" disabled variant="light">
          <Fa6SolidAngleRight />
        </ActionIcon>
      )}
    </Group>
  );
};

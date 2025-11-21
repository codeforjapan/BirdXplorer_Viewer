import type { GroupProps } from "@mantine/core";
import { ActionIcon, Group, Text } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { getQuery, withQuery } from "ufo";
import type { z } from "zod";

import { buildPaginationMeta } from "~/feature/search/pagination";
import type { noteSearchParamSchema } from "~/feature/search/validation";
import type { PaginationMeta } from "~/generated/api/schemas/paginationMeta";
import { useNetworkBusy } from "~/hooks/useNetworkBusy";
import Fa6SolidAngleLeft from "~icons/fa6-solid/angle-left";
import Fa6SolidAngleRight from "~icons/fa6-solid/angle-right";

type PaginationProps = {
  meta: PaginationMeta;
  currentQuery: z.infer<typeof noteSearchParamSchema>;
  loading?: boolean;
  /**
   * 検索結果として表示している現在のページに表示しているデータの件数
   */
  visibleItemCount: number;
} & GroupProps;

export const SearchPagination = ({
  currentQuery,
  meta,
  loading,
  visibleItemCount,
  ...groupProps
}: PaginationProps) => {
  const isNetworkBusy = useNetworkBusy();

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

  const [clickedButton, setClickedButton] = useState<"prev" | "next">();

  const prevLoading = (loading && clickedButton === "prev") ?? false;
  const nextLoading = (loading && clickedButton === "next") ?? false;

  const handlePrevClick = useCallback(() => {
    setClickedButton("prev");
  }, []);

  const handleNextClick = useCallback(() => {
    setClickedButton("next");
  }, []);

  return (
    <Group {...groupProps}>
      <Text>
        {pageFirstItemIndex} ～ {totalDisplayedItems} 件目を表示中
      </Text>
      {prevTo ? (
        <ActionIcon
          aria-label="前のページへ移動する"
          color="pink"
          component={Link}
          disabled={isNetworkBusy}
          loading={prevLoading}
          onClick={handlePrevClick}
          to={prevTo}
          variant="light"
        >
          <Fa6SolidAngleLeft />
        </ActionIcon>
      ) : (
        <ActionIcon aria-hidden color="pink" disabled variant="light">
          <Fa6SolidAngleLeft />
        </ActionIcon>
      )}
      {nextTo ? (
        <ActionIcon
          aria-label="次のページへ移動する"
          color="pink"
          component={Link}
          disabled={isNetworkBusy}
          loading={nextLoading}
          onClick={handleNextClick}
          to={nextTo}
          variant="light"
        >
          <Fa6SolidAngleRight />
        </ActionIcon>
      ) : (
        <ActionIcon aria-hidden color="pink" disabled variant="light">
          <Fa6SolidAngleRight />
        </ActionIcon>
      )}
    </Group>
  );
};

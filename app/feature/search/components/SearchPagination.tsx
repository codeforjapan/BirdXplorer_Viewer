import type { GroupProps } from "@mantine/core";
import { ActionIcon, Group, Text } from "@mantine/core";
import { Link } from "@remix-run/react";
import { useCallback, useMemo, useState } from "react";
import { getQuery, withQuery } from "ufo";
import type { z } from "zod";

import Fa6SolidAngleLeft from "~icons/fa6-solid/angle-left";
import Fa6SolidAngleRight from "~icons/fa6-solid/angle-right";

import type { PaginationMeta } from "../../../generated/api/schemas/paginationMeta";
import type { noteSearchParamSchema } from "../validation";

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
  const pageFirstItemIndex = currentQuery.offset + 1;
  const totalDisplayedItems = currentQuery.offset + visibleItemCount;

  const prevTo = useMemo(
    () => (meta?.prev ? withQuery("/", getQuery(meta.prev)) : null),
    [meta?.prev],
  );
  const nextTo = useMemo(
    () => (meta?.next ? withQuery("/", getQuery(meta.next)) : null),
    [meta?.next],
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

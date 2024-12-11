/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  GetNotesApiV1DataNotesGetParams,
  GetPostsApiV1DataPostsGetParams,
  HTTPValidationError,
  Message,
  NoteListResponse,
  PostListResponse,
  SearchApiV1DataSearchGetParams,
  SearchResponse,
  TopicListResponse,
  UserEnrollment,
} from "./schemas";

/**
 * @summary Ping
 */
export type pingApiV1SystemPingGetResponse = {
  data: Message;
  status: number;
  headers: Headers;
};

export const getPingApiV1SystemPingGetUrl = () => {
  return `https://birdxplorer.onrender.com/api/v1/system/ping`;
};

export const pingApiV1SystemPingGet = async (
  options?: RequestInit
): Promise<pingApiV1SystemPingGetResponse> => {
  const res = await fetch(getPingApiV1SystemPingGetUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getPingApiV1SystemPingGetQueryKey = () => {
  return [`https://birdxplorer.onrender.com/api/v1/system/ping`] as const;
};

export const getPingApiV1SystemPingGetQueryOptions = <
  TData = Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
      TError,
      TData
    >
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getPingApiV1SystemPingGetQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof pingApiV1SystemPingGet>>
  > = ({ signal }) => pingApiV1SystemPingGet({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type PingApiV1SystemPingGetQueryResult = NonNullable<
  Awaited<ReturnType<typeof pingApiV1SystemPingGet>>
>;
export type PingApiV1SystemPingGetQueryError = unknown;

export function usePingApiV1SystemPingGet<
  TData = Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
  TError = unknown
>(options: {
  query: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
        TError,
        TData
      >,
      "initialData"
    >;
  fetch?: RequestInit;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function usePingApiV1SystemPingGet<
  TData = Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
        TError,
        TData
      >,
      "initialData"
    >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function usePingApiV1SystemPingGet<
  TData = Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
      TError,
      TData
    >
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Ping
 */

export function usePingApiV1SystemPingGet<
  TData = Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof pingApiV1SystemPingGet>>,
      TError,
      TData
    >
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getPingApiV1SystemPingGetQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * コミュニティノート参加ユーザーのデータを取得するエンドポイント
 * @summary Get User Enrollment By Participant Id
 */
export type getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetResponse =
  {
    data: UserEnrollment;
    status: number;
    headers: Headers;
  };

export const getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetUrl =
  (participantId: string) => {
    return `https://birdxplorer.onrender.com/api/v1/data/user-enrollments/${participantId}`;
  };

export const getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet =
  async (
    participantId: string,
    options?: RequestInit
  ): Promise<getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetResponse> => {
    const res = await fetch(
      getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetUrl(
        participantId
      ),
      {
        ...options,
        method: "GET",
      }
    );
    const data = await res.json();

    return { status: res.status, data, headers: res.headers };
  };

export const getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetQueryKey =
  (participantId: string) => {
    return [
      `https://birdxplorer.onrender.com/api/v1/data/user-enrollments/${participantId}`,
    ] as const;
  };

export const getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetQueryOptions =
  <
    TData = Awaited<
      ReturnType<
        typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
      >
    >,
    TError = HTTPValidationError
  >(
    participantId: string,
    options?: {
      query?: Partial<
        UseQueryOptions<
          Awaited<
            ReturnType<
              typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
            >
          >,
          TError,
          TData
        >
      >;
      fetch?: RequestInit;
    }
  ) => {
    const { query: queryOptions, fetch: fetchOptions } = options ?? {};

    const queryKey =
      queryOptions?.queryKey ??
      getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetQueryKey(
        participantId
      );

    const queryFn: QueryFunction<
      Awaited<
        ReturnType<
          typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
        >
      >
    > = ({ signal }) =>
      getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet(
        participantId,
        { signal, ...fetchOptions }
      );

    return {
      queryKey,
      queryFn,
      enabled: !!participantId,
      ...queryOptions,
    } as UseQueryOptions<
      Awaited<
        ReturnType<
          typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
        >
      >,
      TError,
      TData
    > & { queryKey: DataTag<QueryKey, TData> };
  };

export type GetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
      >
    >
  >;
export type GetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetQueryError =
  HTTPValidationError;

export function useGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet<
  TData = Awaited<
    ReturnType<
      typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
    >
  >,
  TError = HTTPValidationError
>(
  participantId: string,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
          >
        >,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<
            ReturnType<
              typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
            >
          >,
          TError,
          TData
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet<
  TData = Awaited<
    ReturnType<
      typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
    >
  >,
  TError = HTTPValidationError
>(
  participantId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
          >
        >,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<
            ReturnType<
              typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
            >
          >,
          TError,
          TData
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet<
  TData = Awaited<
    ReturnType<
      typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
    >
  >,
  TError = HTTPValidationError
>(
  participantId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
          >
        >,
        TError,
        TData
      >
    >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Get User Enrollment By Participant Id
 */

export function useGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet<
  TData = Awaited<
    ReturnType<
      typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
    >
  >,
  TError = HTTPValidationError
>(
  participantId: string,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGet
          >
        >,
        TError,
        TData
      >
    >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions =
    getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetQueryOptions(
      participantId,
      options
    );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * 自動分類されたコミュニティノートのトピック一覧を取得するエンドポイント
 * @summary Get Topics
 */
export type getTopicsApiV1DataTopicsGetResponse = {
  data: TopicListResponse;
  status: number;
  headers: Headers;
};

export const getGetTopicsApiV1DataTopicsGetUrl = () => {
  return `https://birdxplorer.onrender.com/api/v1/data/topics`;
};

export const getTopicsApiV1DataTopicsGet = async (
  options?: RequestInit
): Promise<getTopicsApiV1DataTopicsGetResponse> => {
  const res = await fetch(getGetTopicsApiV1DataTopicsGetUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getGetTopicsApiV1DataTopicsGetQueryKey = () => {
  return [`https://birdxplorer.onrender.com/api/v1/data/topics`] as const;
};

export const getGetTopicsApiV1DataTopicsGetQueryOptions = <
  TData = Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
      TError,
      TData
    >
  >;
  fetch?: RequestInit;
}) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetTopicsApiV1DataTopicsGetQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>
  > = ({ signal }) => getTopicsApiV1DataTopicsGet({ signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetTopicsApiV1DataTopicsGetQueryResult = NonNullable<
  Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>
>;
export type GetTopicsApiV1DataTopicsGetQueryError = unknown;

export function useGetTopicsApiV1DataTopicsGet<
  TData = Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
  TError = unknown
>(options: {
  query: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
        TError,
        TData
      >,
      "initialData"
    >;
  fetch?: RequestInit;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetTopicsApiV1DataTopicsGet<
  TData = Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
        TError,
        TData
      >,
      "initialData"
    >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetTopicsApiV1DataTopicsGet<
  TData = Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
      TError,
      TData
    >
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Get Topics
 */

export function useGetTopicsApiV1DataTopicsGet<
  TData = Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
  TError = unknown
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTopicsApiV1DataTopicsGet>>,
      TError,
      TData
    >
  >;
  fetch?: RequestInit;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetTopicsApiV1DataTopicsGetQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * コミュニティノートのデータを取得するエンドポイント
 * @summary Get Notes
 */
export type getNotesApiV1DataNotesGetResponse = {
  data: NoteListResponse;
  status: number;
  headers: Headers;
};

export const getGetNotesApiV1DataNotesGetUrl = (
  params?: GetNotesApiV1DataNotesGetParams
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  return normalizedParams.size
    ? `https://birdxplorer.onrender.com/api/v1/data/notes?${normalizedParams.toString()}`
    : `https://birdxplorer.onrender.com/api/v1/data/notes`;
};

export const getNotesApiV1DataNotesGet = async (
  params?: GetNotesApiV1DataNotesGetParams,
  options?: RequestInit
): Promise<getNotesApiV1DataNotesGetResponse> => {
  const res = await fetch(getGetNotesApiV1DataNotesGetUrl(params), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getGetNotesApiV1DataNotesGetQueryKey = (
  params?: GetNotesApiV1DataNotesGetParams
) => {
  return [
    `https://birdxplorer.onrender.com/api/v1/data/notes`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetNotesApiV1DataNotesGetInfiniteQueryOptions = <
  TData = InfiniteData<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    GetNotesApiV1DataNotesGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetNotesApiV1DataNotesGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        QueryKey,
        GetNotesApiV1DataNotesGetParams["offset"]
      >
    >;
    fetch?: RequestInit;
  }
) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetNotesApiV1DataNotesGetQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    QueryKey,
    GetNotesApiV1DataNotesGetParams["offset"]
  > = ({ signal, pageParam }) =>
    getNotesApiV1DataNotesGet(
      { ...params, offset: pageParam || params?.["offset"] },
      { signal, ...fetchOptions }
    );

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    TError,
    TData,
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    QueryKey,
    GetNotesApiV1DataNotesGetParams["offset"]
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetNotesApiV1DataNotesGetInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>
>;
export type GetNotesApiV1DataNotesGetInfiniteQueryError = HTTPValidationError;

export function useGetNotesApiV1DataNotesGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    GetNotesApiV1DataNotesGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params: undefined | GetNotesApiV1DataNotesGetParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        QueryKey,
        GetNotesApiV1DataNotesGetParams["offset"]
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
          TError,
          TData,
          QueryKey
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetNotesApiV1DataNotesGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    GetNotesApiV1DataNotesGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetNotesApiV1DataNotesGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        QueryKey,
        GetNotesApiV1DataNotesGetParams["offset"]
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
          TError,
          TData,
          QueryKey
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetNotesApiV1DataNotesGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    GetNotesApiV1DataNotesGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetNotesApiV1DataNotesGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        QueryKey,
        GetNotesApiV1DataNotesGetParams["offset"]
      >
    >;
    fetch?: RequestInit;
  }
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
/**
 * @summary Get Notes
 */

export function useGetNotesApiV1DataNotesGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
    GetNotesApiV1DataNotesGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetNotesApiV1DataNotesGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getNotesApiV1DataNotesGet>>,
        QueryKey,
        GetNotesApiV1DataNotesGetParams["offset"]
      >
    >;
    fetch?: RequestInit;
  }
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetNotesApiV1DataNotesGetInfiniteQueryOptions(
    params,
    options
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Post のデータを取得するエンドポイント
 * @summary Get Posts
 */
export type getPostsApiV1DataPostsGetResponse = {
  data: PostListResponse;
  status: number;
  headers: Headers;
};

export const getGetPostsApiV1DataPostsGetUrl = (
  params?: GetPostsApiV1DataPostsGetParams
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  return normalizedParams.size
    ? `https://birdxplorer.onrender.com/api/v1/data/posts?${normalizedParams.toString()}`
    : `https://birdxplorer.onrender.com/api/v1/data/posts`;
};

export const getPostsApiV1DataPostsGet = async (
  params?: GetPostsApiV1DataPostsGetParams,
  options?: RequestInit
): Promise<getPostsApiV1DataPostsGetResponse> => {
  const res = await fetch(getGetPostsApiV1DataPostsGetUrl(params), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getGetPostsApiV1DataPostsGetQueryKey = (
  params?: GetPostsApiV1DataPostsGetParams
) => {
  return [
    `https://birdxplorer.onrender.com/api/v1/data/posts`,
    ...(params ? [params] : []),
  ] as const;
};

export const getGetPostsApiV1DataPostsGetInfiniteQueryOptions = <
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    GetPostsApiV1DataPostsGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetPostsApiV1DataPostsGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        QueryKey,
        GetPostsApiV1DataPostsGetParams["offset"]
      >
    >;
    fetch?: RequestInit;
  }
) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetPostsApiV1DataPostsGetQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    QueryKey,
    GetPostsApiV1DataPostsGetParams["offset"]
  > = ({ signal, pageParam }) =>
    getPostsApiV1DataPostsGet(
      { ...params, offset: pageParam || params?.["offset"] },
      { signal, ...fetchOptions }
    );

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    TError,
    TData,
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    QueryKey,
    GetPostsApiV1DataPostsGetParams["offset"]
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetPostsApiV1DataPostsGetInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>
>;
export type GetPostsApiV1DataPostsGetInfiniteQueryError = HTTPValidationError;

export function useGetPostsApiV1DataPostsGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    GetPostsApiV1DataPostsGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params: undefined | GetPostsApiV1DataPostsGetParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        QueryKey,
        GetPostsApiV1DataPostsGetParams["offset"]
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
          TError,
          TData,
          QueryKey
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetPostsApiV1DataPostsGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    GetPostsApiV1DataPostsGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetPostsApiV1DataPostsGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        QueryKey,
        GetPostsApiV1DataPostsGetParams["offset"]
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
          TError,
          TData,
          QueryKey
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetPostsApiV1DataPostsGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    GetPostsApiV1DataPostsGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetPostsApiV1DataPostsGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        QueryKey,
        GetPostsApiV1DataPostsGetParams["offset"]
      >
    >;
    fetch?: RequestInit;
  }
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
/**
 * @summary Get Posts
 */

export function useGetPostsApiV1DataPostsGetInfinite<
  TData = InfiniteData<
    Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
    GetPostsApiV1DataPostsGetParams["offset"]
  >,
  TError = HTTPValidationError
>(
  params?: GetPostsApiV1DataPostsGetParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        TError,
        TData,
        Awaited<ReturnType<typeof getPostsApiV1DataPostsGet>>,
        QueryKey,
        GetPostsApiV1DataPostsGetParams["offset"]
      >
    >;
    fetch?: RequestInit;
  }
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetPostsApiV1DataPostsGetInfiniteQueryOptions(
    params,
    options
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * アドバンスドサーチでデータを取得するエンドポイント
 * @summary Search
 */
export type searchApiV1DataSearchGetResponse = {
  data: SearchResponse;
  status: number;
  headers: Headers;
};

export const getSearchApiV1DataSearchGetUrl = (
  params?: SearchApiV1DataSearchGetParams
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  return normalizedParams.size
    ? `https://birdxplorer.onrender.com/api/v1/data/search?${normalizedParams.toString()}`
    : `https://birdxplorer.onrender.com/api/v1/data/search`;
};

export const searchApiV1DataSearchGet = async (
  params?: SearchApiV1DataSearchGetParams,
  options?: RequestInit
): Promise<searchApiV1DataSearchGetResponse> => {
  const res = await fetch(getSearchApiV1DataSearchGetUrl(params), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

export const getSearchApiV1DataSearchGetQueryKey = (
  params?: SearchApiV1DataSearchGetParams
) => {
  return [
    `https://birdxplorer.onrender.com/api/v1/data/search`,
    ...(params ? [params] : []),
  ] as const;
};

export const getSearchApiV1DataSearchGetQueryOptions = <
  TData = Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
  TError = HTTPValidationError
>(
  params?: SearchApiV1DataSearchGetParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
        TError,
        TData
      >
    >;
    fetch?: RequestInit;
  }
) => {
  const { query: queryOptions, fetch: fetchOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getSearchApiV1DataSearchGetQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof searchApiV1DataSearchGet>>
  > = ({ signal }) =>
    searchApiV1DataSearchGet(params, { signal, ...fetchOptions });

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type SearchApiV1DataSearchGetQueryResult = NonNullable<
  Awaited<ReturnType<typeof searchApiV1DataSearchGet>>
>;
export type SearchApiV1DataSearchGetQueryError = HTTPValidationError;

export function useSearchApiV1DataSearchGet<
  TData = Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
  TError = HTTPValidationError
>(
  params: undefined | SearchApiV1DataSearchGetParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
          TError,
          TData
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useSearchApiV1DataSearchGet<
  TData = Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
  TError = HTTPValidationError
>(
  params?: SearchApiV1DataSearchGetParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
          TError,
          TData
        >,
        "initialData"
      >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useSearchApiV1DataSearchGet<
  TData = Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
  TError = HTTPValidationError
>(
  params?: SearchApiV1DataSearchGetParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
        TError,
        TData
      >
    >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
/**
 * @summary Search
 */

export function useSearchApiV1DataSearchGet<
  TData = Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
  TError = HTTPValidationError
>(
  params?: SearchApiV1DataSearchGetParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof searchApiV1DataSearchGet>>,
        TError,
        TData
      >
    >;
    fetch?: RequestInit;
  }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getSearchApiV1DataSearchGetQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

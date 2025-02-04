/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type {
  GetNotesApiV1DataNotesGetParams,
  GetPostsApiV1DataPostsGetParams,
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
  options?: RequestInit,
): Promise<pingApiV1SystemPingGetResponse> => {
  const res = await fetch(getPingApiV1SystemPingGetUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

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
    options?: RequestInit,
  ): Promise<getUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetResponse> => {
    const res = await fetch(
      getGetUserEnrollmentByParticipantIdApiV1DataUserEnrollmentsParticipantIdGetUrl(
        participantId,
      ),
      {
        ...options,
        method: "GET",
      },
    );
    const data = await res.json();

    return { status: res.status, data, headers: res.headers };
  };

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
  options?: RequestInit,
): Promise<getTopicsApiV1DataTopicsGetResponse> => {
  const res = await fetch(getGetTopicsApiV1DataTopicsGetUrl(), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

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
  params?: GetNotesApiV1DataNotesGetParams,
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
  options?: RequestInit,
): Promise<getNotesApiV1DataNotesGetResponse> => {
  const res = await fetch(getGetNotesApiV1DataNotesGetUrl(params), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

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
  params?: GetPostsApiV1DataPostsGetParams,
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
  options?: RequestInit,
): Promise<getPostsApiV1DataPostsGetResponse> => {
  const res = await fetch(getGetPostsApiV1DataPostsGetUrl(params), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

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
  params?: SearchApiV1DataSearchGetParams,
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
  options?: RequestInit,
): Promise<searchApiV1DataSearchGetResponse> => {
  const res = await fetch(getSearchApiV1DataSearchGetUrl(params), {
    ...options,
    method: "GET",
  });
  const data = await res.json();

  return { status: res.status, data, headers: res.headers };
};

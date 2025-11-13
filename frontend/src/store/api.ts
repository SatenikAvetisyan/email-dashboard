import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export interface Email {
  _id: string;
  messageId?: string;
  subject?: string;
  from?: string;
  to?: string[];
  date?: string; // iso string
  snippet?: string;
  folder?: string;
  flags?: string[];
  aiSummary?: string;
  aiKeywords?: string[];
  // timestamps si los usas
  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  q?: string;
}

/* Respuestas concretas */
export interface LoginResponse { token: string; }
export interface RegisterResponse { id: string; email: string; }
export interface SyncResponse { synced: number; }
export interface SummarizeResponse { id: string; aiSummary: string; aiKeywords: string[]; }
export interface SetFlagResponse { id: string; flags: string[]; }

/* Request payload types */
export interface FetchEmailsArgs { q?: string; page?: number; limit?: number; }
export interface SetFlagArgs { id: string; flag: string; value: boolean; }


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ["Emails"],
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body })
    }),
    register: build.mutation<RegisterResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body })
    }),
    fetchEmails: build.query<Paginated<Email>, FetchEmailsArgs>({
      query: ({ q = "", page = 1, limit = 20 } = {}) =>
        `/emails?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`,
      providesTags: (result) => {
        if (!result) return [{ type: "Emails" as const, id: "LIST" as const }];
        const itemTags = result.items.map((r) => ({ type: "Emails" as const, id: r._id }));
        return [...itemTags, { type: "Emails" as const, id: "LIST" as const }];
      }
    }),
    getEmail: build.query<Email, string>({
      query: (id) => `/emails/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Emails" as const, id }]
    }),
    syncInbox: build.mutation<SyncResponse, { limit?: number } | void>({
      query: (arg) => {
        const limit = arg?.limit ?? 20;
        return { url: `/emails/sync?limit=${limit}`, method: "POST" };
      },
      invalidatesTags: [{ type: "Emails", id: "LIST" }]
    }),
    summarize: build.mutation<SummarizeResponse, string>({
      query: (id) => ({ url: `/emails/${id}/summarize`, method: "POST" }),
      invalidatesTags: (_res, _err, id) => [{ type: "Emails" as const, id }]
    }),
    setFlag: build.mutation<SetFlagResponse, SetFlagArgs>({
      query: ({ id, flag, value }) => ({ url: `/emails/${id}/flags`, method: "PATCH", body: { flag, value } }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Emails" as const, id }, { type: "Emails" as const, id: "LIST" as const }]
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useFetchEmailsQuery,
  useGetEmailQuery,
  useSyncInboxMutation,
  useSummarizeMutation,
  useSetFlagMutation
} = api;

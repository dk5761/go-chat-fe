import { getApiRQ } from "@/services/api/api";
import { getProfileUrl, getUsersUrl } from "@/services/api/constants";
import { queryParamType } from "@/types";

import { generateCacheQueryKeyForOptions } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";

export interface GetUsers {
  pagination: Pagination;
  users: User[];
}

export interface Pagination {
  currentPage: number;
  limit: number;
  offset: number;
  totalItems: number;
  totalPages: number;
}

export interface User {
  created_at: string;
  email: string;
  id: string;
  last_login: string;
  updated_at: string;
  username: string;
}

export function useGetUsers({
  options,
  queryParams,
}: {
  options: any;
  queryParams?: queryParamType<GetUsers, Error>;
}) {
  const queryKey = generateCacheQueryKeyForOptions("get-users", {
    ...options,
  });

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const url = getUsersUrl(options);
      const response = await getApiRQ<GetUsers>(url);

      console.log({ response });
      return response;
    },
    ...queryParams,
  });
}

export interface Profile {
  email: string;
  id: string;
  last_login: Date;
  username: string;
}

export function useGetProfile({
  queryParams,
}: {
  queryParams?: queryParamType<Profile, Error>;
}) {
  const queryKey = generateCacheQueryKeyForOptions("profile", {});

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const url = getProfileUrl();
      const response = await getApiRQ<Profile>(url);

      console.log({ response });
      return response;
    },
    ...queryParams,
  });
}

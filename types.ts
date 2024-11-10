import { UseQueryOptions } from "@tanstack/react-query";

export type queryParamType<TData, TError = unknown> = Omit<
  UseQueryOptions<TData, TError, TData>,
  "queryKey" | "queryFn"
>;

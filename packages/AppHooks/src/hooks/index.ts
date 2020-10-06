import {
  useQuery,
  useLazyQuery,
  useMutation,
  QueryResult,
  QueryTuple,
  QueryHookOptions,
  MutationTuple,
  MutationHookOptions,
  LazyQueryHookOptions,
  FetchResult,
  MutationResult,
  DocumentNode,
  MutationOptions,
  QueryOptions,
  useSubscription,
  SubscriptionHookOptions,
  SubscriptionResult
} from "@apollo/client";

// ================  QUERY
export const useQueryHook = (
  query: DocumentNode,
  options: QueryHookOptions
): QueryResult => {
  return useQuery(query, options);
};

// ================  LAZY QUERY
export const useLazyQueryHook = (
  query: DocumentNode,
  options: LazyQueryHookOptions
): QueryTuple<QueryOptions, FetchResult> => {
  return useLazyQuery(query, options);
};

// ================  MUTATION
export const useMutationHook = (
  query: DocumentNode,
  options: MutationHookOptions
): MutationTuple<MutationOptions, MutationResult> => {
  return useMutation(query, options);
};

// ================  SUBSCRIPTION
export const useSubscriptionHook = (
  query: DocumentNode,
  options: SubscriptionHookOptions
): SubscriptionResult => {
  return useSubscription(query, options);
};

export default {
  useQueryHook,
  useLazyQueryHook,
  useMutationHook,
  useSubscriptionHook
};

import {
  MutationFunction,
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export interface MutationRequestProps<TData, TVariables> {
  func: MutationFunction<TData, TVariables>;
  invalidateKeys: QueryKey | QueryKey[];
}

export const useMutationRequest = <TData, TVariables>(
  request: MutationRequestProps<TData, TVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: request.func,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: async <TResponse,>(_response: TResponse) => {
      let keys = request.invalidateKeys;
      if (keys.length > 0) {
        if (!Array.isArray(keys)) {
          keys = [keys];
        }

        (keys as QueryKey[]).forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );
      }
    },
  });
};

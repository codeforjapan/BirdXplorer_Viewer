import { useFetchers, useNavigation } from "react-router";

/**
 * Check if any network request is in progress.
 *
 * This is useful for loading indicators or disabling buttons while a request is being made.
 *
 * @returns `true` if any network request is in progress, `false` otherwise.
 */
export const useNetworkBusy = () => {
  const navigation = useNavigation();
  const fetcher = useFetchers();

  return navigation.state !== "idle" || fetcher.some((f) => f.state !== "idle");
};

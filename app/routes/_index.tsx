import type { Route } from "./+types/_index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = (_args: Route.LoaderArgs) => {
  return {};
};

export default function Index({}: Route.ComponentProps) {
  return <main>トップ</main>;
}

import { Container } from "@mantine/core";
import { Link } from "react-router";

import type { Route } from "./+types/_layout.$";

export const meta: Route.MetaFunction = () => [
  { title: "ページが見つかりません - BirdXplorer" },
  { name: "robots", content: "noindex, nofollow" },
];

export const loader = () => {
  return new Response(null, { status: 404 });
};

export default function NotFound() {
  return (
    <Container className="py-8" size="xl">
      <div className="text-center text-white">
        <h1 className="text-heading-xl mb-4">404</h1>
        <p className="text-body-l mb-8">
          お探しのページが見つかりませんでした
        </p>
        <Link to="/" className="text-primary underline">
          トップページに戻る
        </Link>
      </div>
    </Container>
  );
}

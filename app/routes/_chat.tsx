import { Outlet } from "react-router";

export const handle = { standalone: true } as const;

export default function ChatLayout() {
  return <Outlet />;
}

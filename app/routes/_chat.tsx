import { Outlet } from "react-router";

// eslint-disable-next-line react-refresh/only-export-components
export const handle = { standalone: true } as const;

export default function ChatLayout() {
  return <Outlet />;
}

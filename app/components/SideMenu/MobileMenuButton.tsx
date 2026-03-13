import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useLocation } from "react-router";

import { NAV_ITEMS } from "./navItems";
import { SideBarNav } from "./SideBarNav";

export function MobileMenuButton() {
  const [opened, { open, close }] = useDisclosure(false);
  const location = useLocation();

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  return (
    <>
      <Drawer
        onClose={close}
        opened={opened}
        size="200px"
        styles={{
          body: { padding: 0, backgroundColor: "black", height: "100%" },
          content: { backgroundColor: "black" },
        }}
        withCloseButton={false}
      >
        <nav className="flex flex-col p-5 pt-10">
          {NAV_ITEMS.map((item) => (
            <SideBarNav
              key={item.href}
              {...item}
              isActive={item.href === location.pathname}
            />
          ))}
        </nav>
      </Drawer>

      <button
        aria-label="メニューを開く"
        className="flex flex-col items-center justify-center gap-1.5 p-1"
        onClick={open}
        type="button"
      >
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
        <span className="block h-0.5 w-6 bg-white" />
      </button>
    </>
  );
}

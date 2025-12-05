"use client";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <footer
      className={`
        fixed bottom-0 w-full h-14 z-50 bg-white dark:bg-black text-xs text-black dark:text-white flex items-center px-6 sm:px-8 transition-transform duration-300 ease-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="w-full text-center md:text-right">
        Copyright <a href="https://birdxplorer.code4japan.org/">BirdXplorer</a> © 2025 All Rights Reserved.
      </div>
    </footer>
  );
};

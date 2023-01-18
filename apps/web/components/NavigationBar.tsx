"use client";

import config from "@/app/config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import { CloseIcon, HamburgerIcon } from "./Icons";

type NavigationBarItem = {
  label: string;
  href: string;
};

interface NavigationBarProps extends React.ComponentPropsWithoutRef<"nav"> {
  items?: NavigationBarItem[];
}
export default function NavigationBar({ items, ...props }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className={cn("w-full", "bg-primary-light border-b border-black")}>
      <div
        className={cn(
          "container mx-auto max-w-6xl",
          "flex flex-wrap items-center justify-between sm:justify-start"
        )}
      >
        <div
          className={cn(
            "inline-block select-none px-4 py-2 text-2xl font-semibold",
            "bg-black tracking-tighter text-white"
          )}
        >
          <span>{config.site.name}</span>
        </div>
        <div className="flex sm:hidden">
          {isMenuOpen ? (
            <CloseIcon
              size="lg"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            />
          ) : (
            <HamburgerIcon
              size="lg"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            />
          )}
        </div>
        <div
          className={cn(
            !isMenuOpen && "hidden",
            "w-full sm:flex sm:w-auto",
            "items-center justify-between"
          )}
        >
          <ul
            className={cn(
              "flex flex-col gap-4 py-4 pl-4",
              "border-t border-t-black",
              "text-primary-darker font-medium",
              "sm:mt-0 sm:flex-row sm:border-0 sm:py-0 sm:text-sm"
            )}
          >
            {items?.map((item) => (
              <li key={item.href} className="hover:text-black">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={cn(
            !isMenuOpen && "hidden",
            "my-2 w-full",
            "sm:my-0 sm:ml-auto sm:flex sm:w-auto",
            "border-t border-t-black sm:border-0"
          )}
        >
          <Button asLink href="/" variant="text" fullWidth>
            Giriş Yap
          </Button>
          <Button asLink href="/" fullWidth>
            Kayıt Ol
          </Button>
        </div>
      </div>
    </nav>
  );
}

import config from "@/config";
import { AuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Button from "./Button";
import { CloseIcon, HamburgerIcon } from "./Icons";
import Logo from "./Logo";

interface NavigationBarProps extends React.ComponentPropsWithoutRef<"nav"> {}

export default function NavigationBar({
  className,
  ...props
}: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(config.navigation.nonAuth);
  const authContext = useContext(AuthContext);

  const pathName = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathName]);

  useEffect(() => {
    if (authContext.isAuthenticated && authContext.user) {
      if (authContext.user.role === "STUDENT") {
        setMenuItems(config.navigation.auth.student);
      } else if (authContext.user.role === "TEACHER") {
        setMenuItems(config.navigation.auth.teacher);
      }
    } else {
      setMenuItems(config.navigation.nonAuth);
    }
  }, [authContext.isAuthenticated, authContext.user]);

  return (
    <nav
      className={cn(
        "w-full",
        "bg-primary-light border-b border-black",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "container mx-auto max-w-6xl",
          "flex flex-wrap items-center justify-between sm:justify-start"
        )}
      >
        <Logo />
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
            {menuItems.map((item) => (
              <li key={item.label} className="hover:text-black">
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
          {authContext.isAuthenticated ? (
            <>
              <Button asLink href={`/profilim`} variant="text">
                {`${authContext.user?.username}`}
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  authContext.logout();
                }}
              >
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Button asLink href="/giris-yap" variant="text" fullWidth>
                Giriş Yap
              </Button>
              <Button asLink href="/kayit-ol" fullWidth>
                Kayıt Ol
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

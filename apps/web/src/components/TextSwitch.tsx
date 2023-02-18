import { cn, joinReactChildren } from "@/lib/utils";
import { motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ConditionalWrapper from "./ConditionalWrapper";
import { SwitchIcon } from "./Icons";

interface TextSwitchProps extends React.ComponentPropsWithoutRef<"a"> {
  links: {
    href: string;
    label: string;
  }[];
}

export default function TextSwitch({ links, className }: TextSwitchProps) {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState<number | undefined>(undefined);

  const switchIconAnim = useAnimationControls();

  useEffect(() => {
    switchIconAnim.start({
      rotateY: activeLink === 0 ? 0 : 180,
    });
    setActiveLink(links.findIndex((link) => link.href === pathname));
  }, [pathname, links, activeLink, switchIconAnim]);

  return (
    <div className="flex items-center justify-center">
      {joinReactChildren(
        links.map((link) => (
          <div key={link.href} className="text-primary-normal">
            <ConditionalWrapper
              condition={activeLink !== links.indexOf(link)}
              wrapper={(children) => (
                <Link
                  href={link.href}
                  className={cn(
                    "text-primary-darker hover:text-primary-dark transition duration-100",
                    className
                  )}
                >
                  {children}
                </Link>
              )}
            >
              <span className={cn("select-none", className)}>{link.label}</span>
            </ConditionalWrapper>
          </div>
        )),
        <motion.span animate={switchIconAnim}>
          <SwitchIcon
            svgClassName="md:h-8 md:w-8 h-5 w-5 mt-1 md:mt-0"
            stroke="thicker"
            className="mx-2 inline-block text-white"
          />
        </motion.span>
      )}
    </div>
  );
}

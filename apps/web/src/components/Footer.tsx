import config from "@/config";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-primary-light text-primary-darker w-full border-y border-black py-8">
      <div className="grid grid-cols-2 gap-8 sm:mx-auto sm:max-w-6xl md:grid-cols-4 lg:grid-cols-5">
        <div className="-mt-8 w-full sm:-my-8 sm:min-w-max sm:max-w-max">
          <Logo />
        </div>
        {config.footer.items.map((item) => (
          <div key={item.heading} className="mx-4 space-y-4 sm:mx-0">
            <h2 className="font-semibold text-black">{item.heading}</h2>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              {item.items.map((link) => (
                <Link key={link.label} href={link.href}>
                  <li className="hover:text-black">{link.label}</li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

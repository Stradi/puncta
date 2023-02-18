import config from "@/config";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="w-full border-y border-black bg-primary-light pt-8 text-primary-darker">
      <div className="grid grid-cols-2 gap-8 sm:mx-auto sm:max-w-6xl md:grid-cols-4 lg:grid-cols-5">
        <div className="-mt-8 w-full sm:-my-8 sm:min-w-max sm:max-w-max">
          <Logo />
        </div>
        {config.footer.items.map((item) => (
          <div key={item.heading} className="mx-4 space-y-4 sm:mx-0">
            <h2 className="font-semibold text-black">{item.heading}</h2>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              {item.items.map((link) => (
                <li key={link.label} className="py-1 pr-2 hover:text-black">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* IDEA: We could link some legal pages on copyright text */}
      <div className="mt-8 select-none bg-black text-white">
        <span className="block text-center text-xs">
          Copyright &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">{config.site.name}</span>
        </span>
      </div>
    </footer>
  );
}

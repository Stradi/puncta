import { cn } from "@/lib/utils";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <title>{`Profilim | The Puncta`}</title>
      </Head>
      <div className="container mx-auto max-w-6xl">
        <header className={cn("mb-8 px-4")}>
          <h2 className="text-2xl font-medium sm:text-3xl">
            <b>Profilim</b>
          </h2>
        </header>
      </div>
    </>
  );
}

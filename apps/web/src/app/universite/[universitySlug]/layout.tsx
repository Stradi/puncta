import React from "react";
import { BaseProps, fetchUniversity } from "./helpers";

export default async function Layout({
  children,
  params,
}: BaseProps & React.PropsWithChildren) {
  const university = await fetchUniversity(params.universitySlug);

  return (
    <main>
      <header>
        <h1>{university.name}</h1>
      </header>
      <section>
        <div>
          <ul className="flex gap-4">
            <li>Genel</li>
            <li>Bölümler</li>
            <li>Öğretmenler</li>
          </ul>
        </div>
        <div>{children}</div>
      </section>
    </main>
  );
}

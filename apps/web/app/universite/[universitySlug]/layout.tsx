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
      <section>{children}</section>
    </main>
  );
}

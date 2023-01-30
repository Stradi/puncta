import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Page() {
  const authContext = useContext(AuthContext);

  return (
    <div className="container mx-auto mt-16 max-w-6xl">
      <header>
        <h2 className="text-3xl font-medium">
          Selam, {authContext.user?.firstName}!
        </h2>
      </header>
    </div>
  );
}

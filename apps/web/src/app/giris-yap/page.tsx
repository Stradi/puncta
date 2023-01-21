"use client";

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";

import { useRouter } from "next/navigation";

//TODO: We should probably use a form library such as Formik.
export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);
  const router = useRouter();

  async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await authContext.login(username, password);

    if (result) {
      router.push("/");
    } else {
      alert("Kullanıcı adı veya şifre yanlış!");
    }
  }

  return (
    <div className="mx-auto my-16 max-w-lg space-y-4 border border-black p-4">
      <h1 className="text-center text-3xl font-bold">Giriş Yap</h1>
      <form className="space-y-4" onSubmit={onFormSubmit}>
        <TextInput
          label="Kullanıcı Adı"
          placeholder="Kullanıcı adın"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          label="Şifre"
          placeholder="Şifren"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth>Giriş Yap</Button>
      </form>
      <div className="h-px w-full bg-black"></div>
      <div className="flex justify-center">
        <Button variant="text" className="py-0">
          Şifreni mi unutttun?
        </Button>
      </div>
      <div className="flex w-full items-center justify-center">
        <span className="font-medium">Hesabın yok mu?</span>
        <Button variant="text" className="p-2 py-0">
          Kayıt ol
        </Button>
      </div>
    </div>
  );
}

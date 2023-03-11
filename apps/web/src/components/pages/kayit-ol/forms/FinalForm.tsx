import { SignUpContext } from "@/context/SignUpContext";
import { useContext } from "react";

export default function FinalForm() {
  const signUpContext = useContext(SignUpContext);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium">Son kontrol</h2>
        <p className="text-sm">
          Her şey doğru mu? Değiştirmek istediğin bir şey varsa geri gidip
          değiştirebilirsin. Dikkatli ol, bu bilgileri daha sonra
          değiştiremezsin.
        </p>
      </div>
      <div className="font-medium">
        <p>
          Anladığımız kadarıyla kullanıcı adın{" "}
          <span className="font-bold">{`${signUpContext.username}`}</span>,
          e-postan <span className="font-bold">{signUpContext.email}</span> ve{" "}
          <span className="font-bold">
            {`${signUpContext.university}'nde ${signUpContext.faculty}`}
          </span>{" "}
          bölümü okuyorsun.
        </p>
      </div>
      <p className="font-medium">
        Her şey doğru gözüküyor ise ilerleyebilirsin.
      </p>
    </div>
  );
}

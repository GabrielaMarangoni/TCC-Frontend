import { useRouter } from "next/router";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { useState } from "react";

export default function ChangePassword() {
  const router = useRouter()
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
    try {
      await fetch("http://localhost:3000/api/auth/change_password/"+router.query.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      alert("Senha alterada com sucesso!");
      router.push("/login");
    } catch (error) {
      alert("Aconteceu um erro ao tentar alterar a senha. Por favor, tente novamente.");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-lg w-full space-y-5 flex items-center justify-center flex-col">
        <h1 className="text-2xl font-medium">Alteração de senha</h1>
        <Input
          haslabel
          name="password"
          label="Nova senha"
          placeholder="*******"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          haslabel
          name="password"
          label="Confirme a senha"
          placeholder="*******"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          bg="bg-button"
          rounded="rounded-lg"
          w="w-full"
          h="h-11"
          textColor="text-black"
          textWeight="font-bold"
          formAction="submit"
          onClick={(event) => handleSubmit(event)}
          label="ALTERAR SENHA"
        />
      </div>
    </div>
  );
}
import router from "next/router";
import React, { useEffect, useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";
import Sidebar from "../../../components/Sidebar";
import { divGeneral, textTitle } from "../alunos/styles";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import PasswordInput from "../../../components/InputPassword";

export default function Dashboard() {
  const [password, setPassword] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  
  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setPassword(e.target.value);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = window.localStorage.getItem('user_id');
        const response = await fetch(`http://localhost:3000/api/auth/${userId}`);
        const data = await response.json();
        setName(data.body.nome);
        setEmail(data.body.email);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, [])

  const updatePassword = async () => {
    try {
      const userId = window.localStorage.getItem('user_id');
      const response = await fetch(`http://localhost:3000/api/auth/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        alert("Senha atualizada com sucesso!");
      } else {
        console.error("Erro ao atualizar senha:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
    }
  }

  useEffect(() => {
    setHydrated(true);
  }, [])

  if (!hydrated) {
    return null;
  }

  return (
    <div>
      <Sidebar />
      <div className={divGeneral}>
        <h1 className={textTitle}>Meu perfil</h1>
        <div className="pt-10"></div>
        <HStack>
          <div className="bg-Input w-1/2 rounded-lg p-5 space-y-4">
            <div className="cursor-not-allowed	">
              <h1>Nome</h1>
              <h1 className="bg-Input2 text-grayText w-full h-12 rounded-lg px-3 text-xl flex items-center justify-start">
                {" "}
                {name}
              </h1>
            </div>
            <div className="cursor-not-allowed	">
              <h1>Email</h1>
              <h1 className="bg-Input2 text-grayText w-full h-12 rounded-lg px-3 text-xl flex items-center justify-start">
                {" "}
                {email}
              </h1>
            </div>
            <div>
              <PasswordInput
                label="Senha"
                name="password"
                placeholder="Senha"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <Button
              onClick={async (e) => {
                e.preventDefault();
                await updatePassword();
              }}
              bg="bg-button"
              rounded="rounded-lg"
              w="w-full"
              h="h-11"
              textColor="text-black"
              textWeight="font-bold"
              formAction="submit"
              label="SALVAR"
            />
          </div>
        </HStack>
      </div>
    </div>
  );
}

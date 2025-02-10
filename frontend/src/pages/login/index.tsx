import { useState } from "react";
import router from "next/router";
import React from "react";
import { Input } from "../../components/Input";
import { HStack, VStack } from "@chakra-ui/react";
import { Button } from "../../components/Button";
import { useUser } from "../../../context/loggedUser";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  
  const handlePassword = async () => {
    if(!email) {
      alert("Por favor, insira um email válido para solicitar a recuperação de senha.");
      return;
    }
    try {
      await fetch("http://localhost:3000/api/auth/change_password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      
    } finally {
      alert("Se o email informado estiver cadastrado, você receberá um email com as instruções para recuperação de senha.");
    }
  }

  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/api/auth/login", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log("DATA: ", data)
    if (response.ok) {
      localStorage.setItem("professor_id",data.body.auth.professor_id);
      localStorage.setItem("professor_name",data.body.auth.professor_name);
      localStorage.setItem("user_email",data.body.auth.email);
      localStorage.setItem("user_id",data.body.auth.id);
      if (data.body.auth.isCoord) {
        localStorage.setItem("adm", 'true');
      }
      console.log(" aqui  ",data.body.auth)
      router.push("/geral/dashboard");
    } else {
      alert(data.message); 
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="w-[21rem] h-36 bg-no-repeat bg-logo " />

      <div className="w-492 space-y-5 ">
        <Input
          haslabel
          name="email"
          label="Email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          haslabel
          name="password"
          label="Senha"
          placeholder="*******"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          bg="bg-button"
          rounded="rounded-lg"
          w="w-full"
          h="h-11"
          textColor="text-black"
          textWeight="font-bold"
          formAction="submit"
          onClick={handleLogin}
          label="LOGIN"
        />
      </div>

      <HStack className="pt-2">
        <h1>Esqueceu a senha?</h1>
        <button onClick={handlePassword} className="font-bold text-button underline hover:bg-button hover:text-black duration-300 p-1 rounded">
          Recupere aqui!
        </button>
      </HStack>
    </div>
  );
}

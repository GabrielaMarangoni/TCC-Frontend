// No componente AddCalendario.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; 
import { HStack, Stack } from "@chakra-ui/react";
import Sidebar from "../../../components/Sidebar";
import { divRegister, textTitle } from "../alunos/styles";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export default function AddCalendario() {
  const [calendarioUrl, setCalendarioUrl] = useState("");
  const [cadastredUrl, setCadastredUrl] = useState("");
  const router = useRouter(); 
  const [hydrated, setHydrated] = useState(false);

  function saveCalendario() {
    if (cadastredUrl !== "") {
      const confirmReplace = window.confirm("Já existe uma URL cadastrada. Deseja substituir?");
      if (confirmReplace) {
        createCalendario(calendarioUrl);
      }
    } else {
      createCalendario(calendarioUrl);
    }
  }

  async function getCalendario() {
    try {
      const response = await fetch("http://localhost:3000/api/last/calendario");
      const data = await response.json();
      if (data.body && data.body.calendario)
        setCadastredUrl(data.body.calendario.LINK);

    } catch (error) {
      console.error("Erro ao cadastrar calendário:", error);
    }
  }

  async function createCalendario(link: string) {
    let newLink = link;
    if (!link.includes("http://") && !link.includes("https://")) {
      newLink = "http://" + link;
    }
    try {
      const response = await fetch("http://localhost:3000/api/calendario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ link: newLink })
      });

      if (response.ok) {
        router.push("/gerenciamento/calendario");
        setCadastredUrl(link);
      } else {
        console.error("Erro ao cadastrar calendário:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar calendário:", error);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;
    setCalendarioUrl(inputValue);
  }

  useEffect(() => {
    getCalendario();
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, [])

  if (!hydrated) {
    return null;
  }

  return (
    <div>
      <Sidebar />
      <div className={divRegister}>
        <HStack className="flex justify-between pb-10">
          <h1 className={textTitle}>Cadastro do Calendário Acadêmico</h1>
        </HStack>
        <Stack>
          <div className="p-8 bg-[#EAEAEA] rounded-lg">
            <Input
              haslabel
              name="calendario"
              label="Link do calendário acadêmico"
              placeholder="http://"
              value={calendarioUrl}
              onChange={handleInputChange}
            />
            <div className="pt-8">
              <Button
                onClick={saveCalendario}
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
          </div>
          <div>
            <h1 className="text-xl font-bold pt-8">Calendário cadastrado:</h1>
            <a href={cadastredUrl} target="_blank" rel="noreferrer" className="text-blue-500">
              {cadastredUrl}
            </a>
          </div>
        </Stack>
      </div>
    </div>
  );
}

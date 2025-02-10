import React, { useEffect, useState } from "react";
import {
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Sidebar from "../../../../../components/Sidebar";
import { Button } from "../../../../../components/Button";
import { divRegister, textTitle } from "../../styles";
import { TextArea } from "../../../../../components/TextArea";
import { Input } from "../../../../../components/Input";
import { useRouter } from "next/router";

export default function EditAlunos() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    telefone: "",
    email: ""
  });
  const [hydrated, setHydrated] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.telefone || !formData.email) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    }
    try {
      const id = router.query.id;
      const response = await fetch("http://localhost:3000/api/professors/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          telefone: formData.telefone.replace(/\D/g, '')
        })
      });

      if (response.ok) {
        router.push("/gerenciamento/professores");
      } else {
        console.error("Erro ao cadastrar professor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
    }
  };

  async function getProf() {
    try {
      const id = router.query.id;
      const response = await fetch("http://localhost:3000/api/professors/" + id);
      const data = await response.json();
      console.log(data);
      if (data && data?.body) {
        const s = data.body.professor;
        setFormData({
          name: s.NAME,
          telefone: s.TELEFONE,
          email: s.EMAIL
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  function hadleBack() {
    router.push("/gerenciamento/professores");
  }

  useEffect(() => {
    getProf();
  }, [router.query.id]);

  useEffect(() => {
    setHydrated(true);
  }, [])

  if (!hydrated) {
    return null;
  }

      // Função para aplicar a máscara de telefone
      const maskPhone = (value: string) => {
        // Remove todos os caracteres não numéricos
        const cleanValue = value.replace(/\D/g, '');
        
        if (cleanValue.length <= 10) {
          // Formato: (XX) XXXX-XXXX
          return cleanValue
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 14);
        } else {
          // Formato: (XX) XXXXX-XXXX
          return cleanValue
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 15);
        }
      };
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleChangePhone = (e: any) => {
        const { name, value } = e.target;
        const maskedValue = maskPhone(value);
        setFormData((prevData) => ({
          ...prevData,
          [name]: maskedValue
        }));
      };

  return (
    <div>
      <Sidebar />
      <div className={divRegister}>
        <div className="flex  justify-between pb-10	">
          <h1 className={textTitle}>Editar aluno</h1>
          <Button
            onClick={hadleBack}
            bg="bg-warning"
            rounded="rounded-lg"
            w="w-32"
            h="h-11"
            textColor="text-black"
            textWeight="font-bold"
            label="VOLTAR"
          />
        </div>

        <Stack className="flex ">
          <Stack>
            <Input
              haslabel
              name="name"
              label="Nome do professor"
              placeholder="nome"
              onChange={handleChange}
              value={formData.name}
            />

            <Input
              haslabel
              name="telefone"
              label="Telefone"
              placeholder="(**) * ****-****"
              onChange={handleChangePhone}
              value={formData.telefone}
            />
            <Input
              haslabel
              name="email"
              label="Email"
              placeholder="email"                    
              onChange={handleChange}
              value={formData.email}
              disabled
            />

            {showErrorMessage && (
              <h1 className="text-warning text-lg font-bold pt-3">Por favor, preencha todos os campos.</h1>
            )}

            <div className={showErrorMessage ? "" : "pt-5"}>
              <Button
                onClick={handleSubmit}
                bg="bg-button"
                rounded="rounded-lg"
                w="w-full"
                h="h-12"
                textColor="text-black"
                textWeight="font-bold"
                formAction="submit"
                label="SALVAR"
              />
            </div>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}

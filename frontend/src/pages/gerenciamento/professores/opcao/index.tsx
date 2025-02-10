import router from "next/router";
import React, { useState } from "react";
import {
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Sidebar from "../../../../components/Sidebar";
import { Button } from "../../../../components/Button";
import { divRegister, textTitle } from "../../alunos/styles";
import { TextArea } from "../../../../components/TextArea";
import { Select } from "../../../../components/Select";
import { Input } from "../../../../components/Input";

export default function OpcaoProf() {
  const [formData, setFormData] = useState({
    name: "",
    telefone: "",
    email: ""
  });
  const [formData2, setFormData2] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.telefone || !formData.email) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: 'cors', 
        credentials: 'same-origin', 
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

  function hadleBack() {
    router.push("/gerenciamento/professores/");
  }

  async function handleSubmitForMany() {
    if (!formData2) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    } 

    try {
      const response = await fetch("http://localhost:3000/api/many/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ professores: formData2 })
      });

      if (response.ok) {
        router.push("/gerenciamento/professores");
      } else {
        console.error("Erro ao cadastrar professores:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar professores:", error);
    }
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
          <h1 className={textTitle}>Cadastro dos professores</h1>
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
          <Tabs size="lg">
            <TabList>
              <Tab>Único professor</Tab>
              <Tab>Conjunto de professores</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>
                <Stack>
                  <TextArea
                    haslabel
                    label="Nome do professor, telefone e email *um professor por linha*"
                    placeholder="ex: Rafael Liberato , 43988541425, rafael@gmail.com"
                    top="mt-2"
                    onChange={(e) => setFormData2(e.target.value)}
                    value={formData2}
                  />

                  <div className="pt-5">
                    <Button
                      onClick={handleSubmitForMany}
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
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </div>
    </div>
  );
}

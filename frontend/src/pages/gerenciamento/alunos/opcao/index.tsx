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
import { divRegister, textTitle } from "../styles";
import { TextArea } from "../../../../components/TextArea";
import { Input } from "../../../../components/Input";

export default function AddAlunos() {
  const [formData, setFormData] = useState({
    ra: "",
    name: "",
    telefone: "",
    email: ""
  });
  const [formData2, setFormData2] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleSubmit = async () => {
    if (!formData.ra || !formData.name || !formData.telefone || !formData.email) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/estudantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          telefone: formData.telefone.replace(/\D/g, '')
        })
      });

      if (response.ok) {
        router.push("/gerenciamento/alunos");
      } else {
        console.error("Erro ao cadastrar estudante:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar estudante:", error);
    }
  };

  function hadleBack() {
    router.push("/gerenciamento/alunos/");
  }

  async function validateManySubmit() {
    let hasErrors = false;

    // Verifica se o campo de texto está vazio
    if (!formData2) {
      alert("Por favor, preencha todos os campos.");
      hasErrors = true;
      return false;
    }

    // Verifica se cada linha tem 4 campos
    const linhas = formData2.split('\n');
    linhas.forEach(linha => {
      const campos = linha.split(',');
      if (campos.length !== 4) {
        alert("Atenção: cada linha deve conter 4 campos separados por vírgula.");

        hasErrors = true;
        return false;
      }
    });

    // Verifica se todos os campos estão preenchidos
    linhas.forEach((linha, i) => {
      const campos = linha.split(',');
      if (campos.some(campo => campo.trim() === '')) {
        alert(`Por favor, preencha todos os campos da linha ${i + 1}.`);

        hasErrors = true;
        return false;
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    linhas.forEach((linha, i) => {
      const email = linha.split(',')[3].trim();
      if (!emailRegex.test(email)) {
        alert(`O email da linha ${i + 1} é inválido.`);

        hasErrors = true;
        return false;
      }
    });

    const emails = linhas.map(linha => linha.split(',')[3].trim());
    const ras = linhas.map(linha => linha.split(',')[0].trim());

    const response = await fetch("http://localhost:3000/api/verify/estudantes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emails, ras })
    });

    const data = await response.json();
    console.log(data);

    if (data.invalidEmails.length > 0) {
      alert(`Os seguintes emails já estão cadastrados: ${data.invalidEmails.join(', ')}`);
      hasErrors = true;
      return false;
    }

    if (data.invalidRas.length > 0) {
      alert(`Os seguintes RAs já estão cadastrados: ${data.invalidRas.join(', ')}`);
      hasErrors = true;
      return false;
    }

    if (hasErrors) {
      return false;
    } else {
      return true;
    }
  }

  async function handleSubmitForMany() {
    const resV = await validateManySubmit();
    if (!resV) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/many/estudantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ estudantes: formData2 })
      });

      if (response.ok) {
        router.push("/gerenciamento/alunos");
      } else {
        console.error("Erro ao cadastrar estudante:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar estudantes:", error);
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
          <h1 className={textTitle}>Cadastro dos alunos</h1>
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
              <Tab>Único aluno</Tab>
              <Tab>Conjunto de alunos</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Stack >
                  <Input
                    haslabel
                    name="name"
                    label="Nome do aluno"
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
                    name="ra"
                    label="RA do aluno"
                    placeholder="RA"                    
                    onChange={handleChange}
                    value={formData.ra}
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
                      h="h-11"
                      textColor="text-black"
                      textWeight="font-bold"
                      formAction="submit"
                      label="SALVAR"
                    />
                  </div>
                </Stack>
              </TabPanel>
              <TabPanel>
                <div>
                  <Stack>
                    <TextArea
                      haslabel
                      label="RA do aluno, nome, telefone, email *um aluno por linha*"
                      placeholder="ex: 2046296, Gabriela Marangoni, 43988547414, marangonigabriela@gmail.com"
                      top="mt-2"
                      value={formData2}
                      onChange={(e) => setFormData2(e.target.value)}
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
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </div>
    </div>
  );
}

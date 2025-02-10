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
        body: JSON.stringify(formData)
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
      if (campos.length !== 1) {
        alert("Atenção: cada linha deve conter 1 campo.");

        hasErrors = true;
        return false;
      }
    });

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
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ras: formData2 })
      });

      if (response.ok) {
        router.push("/gerenciamento/alunos");
      } else {
        console.error("Erro ao excluir estudante:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir estudantes:", error);
    }
  }



  return (
    <div>
      <Sidebar />
      <div className={divRegister}>
        <div className="flex  justify-between pb-10	">
          <h1 className={textTitle}>Excluir alunos</h1>
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
          <div>
            <Stack>
              <TextArea
                haslabel
                label="RA do aluno *um aluno por linha*"
                placeholder="ex: 2046296"
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
                  label="EXCLUIR"
                />
              </div>
            </Stack>
          </div>
        </Stack>
      </div>
    </div>
  );
}

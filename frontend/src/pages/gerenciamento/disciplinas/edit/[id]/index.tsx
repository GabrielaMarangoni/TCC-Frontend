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
import { divRegister, textTitle } from "../../styles"
import { TextArea } from "../../../../../components/TextArea";
import { Input } from "../../../../../components/Input";
import { useRouter } from "next/router";
import { Select } from "../../../../../components/Select";

export default function EditDisciplina() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome_dis: "",
    ano_dis: ""
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
    if (!formData.nome_dis || !formData.ano_dis) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    }
    try {
      const id = router.query.id;
      const response = await fetch("http://localhost:3000/api/disciplinas/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push("/gerenciamento/disciplinas");
      } else {
        alert("Erro ao atualizar disciplina");
      }
    } catch (error) {
      alert("Erro ao atualizar disciplina");
    }
  };

  async function getDisciplina() {
    try {
      const id = router.query.id;
      const response = await fetch("http://localhost:3000/api/disciplinas/" + id);
      const data = await response.json();
      console.log(data);
      if (data && data?.body) {
        const s = data.body.disciplina
        setFormData({
          nome_dis: s.nome_dis,
          ano_dis: s.ano_dis
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  function hadleBack() {
    router.push("/gerenciamento/disciplinas/");
  }

  useEffect(() => {
    getDisciplina();
  }, [router.query.id]);

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
        <div className="flex  justify-between pb-10	">
          <h1 className={textTitle}>Editar disciplina</h1>
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
          <Stack >
            <Input
              haslabel
              name="nome_dis"
              label="Nome da disciplina"
              placeholder="nome"                    
              onChange={handleChange}
              value={formData.nome_dis}

            />
            <Select
              haslabel
              label="Período"
              name="ano_dis"
              onChange={handleChange}
              value={formData.ano_dis}
            >
              <option key="init">Selecione o Período</option>
              <option value="1º ano">1º ano</option>
              <option value="2º ano">2º ano</option>
              <option value="3º ano">3º ano</option>
              <option value="4º ano">4º ano</option>
            </Select>
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
        </Stack>
      </div>
    </div>
  );
}

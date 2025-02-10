import router from "next/router";
import React, { useEffect, useState } from "react";
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
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";

export default function OpcaoDisciplinas() {
  const [formData, setFormData] = useState({
    nome_dis: "",
    ano_dis: ""
  });
  const [formData2, setFormData2] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nome_dis || !formData.ano_dis ) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/disciplinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push("/gerenciamento/disciplinas");
      } else {
        alert("Erro ao cadastrar disciplina");
      }
    } catch (error) {
      alert("Erro ao cadastrar disciplina");
    }
  };

  function hadleBack() {
    router.push("/gerenciamento/disciplinas/");
  }

  function converterParaAnoEscolar(numero: string) {
    const numeroStr = numero.toString().trim();
    switch (numeroStr) {
      case '1': return '1º ano';
      case '2': return '2º ano';
      case '3': return '3º ano';
      case '4': return '4º ano';
      default: return numeroStr;
    }
  }

  async function handleSubmitForMany() {
    if (!formData2) {
      console.error("Todos os campos devem ser preenchidos.");
      setShowErrorMessage(true);
      return;
    } 

    const disciplinasValidas = ['1º ano', '2º ano', '3º ano', '4º ano'];

    let hasErrors = false;
    const linhas = formData2.split('\n');
    const linhasConvertidas: string[] = [];
    linhas.forEach((linha, i) => {
      const campos = linha.split(',');
      
      // Verificar número de campos
      if (campos.length !== 2) {
        alert("Cada linha deve conter o nome e o ano da disciplina.");
        hasErrors = true;
        return;
      }
      
      // Verificar campos não vazios
      if (campos.some(campo => campo.trim() === '')) {
        alert("Por favor, preencha todos os campos na linha " + (i + 1));
        hasErrors = true;
        return;
      }
      
      // Converter e validar ano da disciplina
      const anoInformado = campos[1].trim();
      const anoFormatado = converterParaAnoEscolar(anoInformado);

      if (!disciplinasValidas.includes(anoFormatado)) {
        alert("Ano da disciplina inválido na linha " + (i + 1));
        hasErrors = true;
        return;
      }

      // Atualiza o campo com o valor convertido
      campos[1] = anoFormatado;
      linhasConvertidas.push(campos.join(','));
    });

    if (hasErrors) {
      return;
    }

    console.log((linhasConvertidas).join('\n'));

    try {
      const response = await fetch("http://localhost:3000/api/many/disciplinas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ disciplinas: linhasConvertidas.join('\n') })
      });

      if (response.ok) {
        router.push("/gerenciamento/disciplinas");
      } else {
        console.error("Erro ao cadastrar disciplinas:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao cadastrar disciplinas:", error);
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
      <div className={divRegister}>
        <div className="flex  justify-between pb-10	">
          <h1 className={textTitle}>Cadastro das disciplinas</h1>
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
              <Tab>Única disciplina</Tab>
              <Tab>Conjunto de disciplinas</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Stack>
                  <Input
                    haslabel
                    name="nome_dis"
                    label="Nome da disciplina"
                    placeholder="Nome"
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
                  <div className={showErrorMessage ? "" : "pt-8"}>
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
                <Stack>
                  <TextArea
                    haslabel
                    label="Nome da disciplina, período da disciplina *uma disciplina por linha*"
                    placeholder="ex: Matemática, 1º ano"
                    top="mt-2"
                    onChange={(e) => setFormData2(e.target.value)}
                    value={formData2}
                  />

                  <div className="pt-5">
                    <Button
                      /* onClick={salveRegister} */
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

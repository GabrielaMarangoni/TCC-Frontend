import router from "next/router";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../../components/Sidebar";
import { divGeneral, textTitle } from "../../../gerenciamento/alunos/styles";
import { Alert, HStack, Stack } from "@chakra-ui/react";
import { Button } from "../../../../components/Button";
import { Modal } from "../../../../components/Modal";
import { Select } from "../../../../components/Select";
import { TextArea } from "../../../../components/TextArea";
import { format } from "date-fns";
import moment from "moment";
import { legendMoreLess } from "../../observacao/styles";
import { cn } from "../../../../lib/utils";

export default function Historico() {
  const router = useRouter();
  const [aluno, setAluno] = useState({
    ra: "",
    name: "",
  });
  const [observacoes, setObservacoes] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDisciplina, setSelectedDisciplina] = useState("");
  const [obs, setObs] = useState("");


  const [showAllText, setShowAllText] = useState<boolean[]>([]);

  function truncateText(text: string, maxLength: number, index: number) {
    if (!text) return "";
    if (!showAllText[index] && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  }

  function toggleShowAllText(index: number) {
    const newShowAllTexts = [...showAllText];
    newShowAllTexts[index] = !newShowAllTexts[index];
    setShowAllText(newShowAllTexts);
  }



  function handleBack() {
    router.back();
  }

  async function handleHistorico() {
    const userId = window.localStorage.getItem('user_id');
    let profId = '';

    if (!selectedPeriod || !selectedDisciplina) {
      alert("Selecione um período e uma disciplina");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/professors/");
      const data = await response.json();
      console.log("data: ", data);
      profId = data.find((el: any) => el.USER_ID === userId).ID;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }

    const data = {
      id_prof: profId, 
      ra_aluno: aluno.ra, 
      id_dis: selectedDisciplina, 
      obs
    }
    try {
      await fetch("http://localhost:3000/api/observacoes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      setIsOpen(false);
      await getAluno(router.query.RA);
    } catch (error) {
      alert("Erro ao criar observação");
    }
  }

  async function getAluno(ra: any) {
    console.log(">>>>>>>>>> getAluno");
    const response = await fetch("http://localhost:3000/api/estudantes/" + ra);
    // console.log("response: ", response);

    if (response.status == 404) {
      return router.push("/geral/alunos/");
    }

    console.log(">>>>>>>>>> getAluno 2");
    const data = await response.json();

    setAluno({
      ra: data.body.estudante.ra,
      name: data.body.estudante.NAME,
    });
    console.log(">>> AQ 2: ");

    console.log(">>>>>>>>>> getObservacoes");
    const response2 = await fetch(
      "http://localhost:3000/api/observacoes/aluno/" + ra
    );

    const data2 = await response2.json();
    console.log("json 2: ", data2);

    setObservacoes(data2);

    try {
      const response3 = await fetch("http://localhost:3000/api/disciplinas/");
      const data3 = await response3.json();
      setDisciplinas(data3);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        if (!router.isReady) return;

        await getAluno(router.query.RA);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, [router.isReady]);

  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  function handleOpenModal(id: string) {
    setId(id);
    setIsOpen(true);
  }

  return (
    <div>
      <Sidebar />
      <div className={divGeneral}>
        <HStack justifyContent="space-between">
          <button onClick={handleBack}>
            <i className="ri-arrow-left-line px-2 ri-xl"></i>
            <button className="font-semibold underline text-2xl">Voltar</button>
          </button>

          <Button
            onClick={() => handleOpenModal("")}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-72"
            h="h-14"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="Adicionar uma observação"
          />
          <Modal
            isOpen={isOpen}
            footer={undefined}
            onClose={() => setIsOpen(false)}
            title="Adicionar uma observação "
            size="3xl"
          >
            <h1 className="text-2xl rounded-md bg-Input2 font-bold px-3 py-2">{aluno.name}</h1>
            <HStack justifyContent="space-between" className="pt-3">
              <Select haslabel label="Período" onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option key="init" value={undefined}>Selecione o Período</option>

                <option value='1º ano'>1º ano</option>
                <option value='2º ano'>2º ano</option>
                <option value='3º ano'>3º ano</option>
                <option value='4º ano'>4º ano</option>
              </Select>

              <Select haslabel label="Disciplina" onChange={(e) => setSelectedDisciplina(e.target.value)}>
                <option key="init" value={undefined}>Selecione a um período primeiro</option>

                {disciplinas.filter((el: any) => el.ANO_DIS === selectedPeriod).map((e: any) => (
                  <option key={e.ID_DIS} value={e.ID_DIS}>{e.NOME_DIS}</option>
                ))}
              </Select>
            </HStack>
            <div className="pt-5">
              <TextArea
                haslabel
                label="Observação"
                placeholder="Digite a observação"
                top="mt-2"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
              />
            </div>

            <div className="pt-10">
              <Button
                onClick={() => handleHistorico()}
                bg="bg-button"
                rounded="rounded-lg"
                w="w-full"
                h="h-14"
                textColor="text-black"
                textWeight="font-bold"
                formAction="submit"
                label="SALVAR"
              />
            </div>
          </Modal>
        </HStack>
        <h1 className={textTitle}>{aluno.name}</h1>
       

<Stack spacing={5} className="pt-10">

  {observacoes.length === 0 ? (
    <h1 className="text-gray-500 text-start text-lg">Nenhuma observação encontrada</h1>
  ) : (
    observacoes.map((e: any, index: number) => (
      <div className={cn("border-2 border-button p-5 rounded-xl", e.ID_PROF === localStorage.getItem("professor_id") ? "bg-yellow-100" : "")}>

        <HStack justifyContent="space-between">
          <div className="flex space-x-24 pb-3" style={{ whiteSpace: "nowrap" }}>
           {/*  <h1 className="font-semibold">{e.ESTUDANTE_NAME}</h1> */}
            <h1 className="font-semibold">Feito por {e.PROFESSOR_NAME}</h1>
            <h1 className="font-semibold">
              {e.NOME_DIS} - {e.ANO_DIS} ({moment(e.DATA_OBS).format("YYYY")})
            </h1>
          </div>
          <div className="flex pb-3 space-x-10">
            {e.GRUPOS.length > 0 &&
              e.GRUPOS.filter((el: any) => {
                return el.PROFESSOR[0].ID === localStorage.getItem("professor_id");
              }).map((grupo: any) => (
                <h1 className="bg-amarelo rounded-xl px-3 py-1">{grupo.NOME}</h1>
              ))}
            <h1 className="font-semibold">{moment(e.DATA_OBS).format("DD/MM/YYYY")}</h1>
          </div>
        </HStack>
                          <div className={cn("bg-slate-100 p-4 rounded-lg ", e.ID_PROF === localStorage.getItem("professor_id") ? "bg-yellow-200" : "")}>
          <h1>{truncateText(e.OBS, 190, index)}</h1>
          <div className="text-end">
            {e.OBS.length > 200 ? (
              <button onClick={() => toggleShowAllText(index)} className={legendMoreLess}>
                {showAllText[index] ? "Mostrar menos" : "Mostrar mais"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    ))
  )}
</Stack>

      </div>
    </div>
  );
}

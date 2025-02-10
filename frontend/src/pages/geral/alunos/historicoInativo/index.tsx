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
  const [hydrated, setHydrated] = useState(false);


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
    router.push("/gerenciamento/alunosInativos");
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
  }

  useEffect(() => {
    async function fetchData() {
      try {
        if (!router.isReady) return;
        
        await getAluno(router.query.RA);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
      setHydrated(true);
    }

    fetchData();
  }, [router.isReady]);

  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  function handleOpenModal(id: string) {
    setId(id);
    setIsOpen(true);
  }

  if(!hydrated) {
    return null;
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
        </HStack>
        <h1 className={textTitle}>{aluno.name}</h1>
       
       {/*  <Stack className="pt-10 ">
          {observacoes.map((e: any) => (
            <>
              <HStack justifyContent="space-between" className="pt-10">
                <div className=" flex space-x-32">
                  <h1 className="font-semibold">{e.NAME}</h1>
                  <h1 className="font-semibold">{e.NOME_DIS}</h1>
                </div>

                <h1 className="font-semibold">{format(new Date(e.DATA_OBS), 'dd/MM/yyyy')}</h1>
              </HStack>

              <div className="bg-Input p-4 rounded ">
                <h1>
                  {e.OBS}
                </h1>
              </div>
            </>
          ))}
        </Stack> */}

        <Stack spacing={5} className="pt-10">
                            {observacoes.map((e: any, index: number)=>  (
                                <div className={cn("border-2 border-button p-5 rounded-xl", e.ID_PROF === localStorage.getItem("professor_id") ? "bg-yellow-100" : "")}>
                                  <HStack justifyContent="space-between">
                                    <div
                                      className=" flex space-x-24 pb-3  "
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      <h1 className="font-semibold ">{e.ESTUDANTE_NAME}</h1>
                                      <h1 className="font-semibold  ">
                                        {e.NOME_DIS} - {e.ANO_DIS} (
                                        {moment(e.DATA_OBS).format("YYYY")})
                                      </h1>
                                      <h1 className="font-semibold  ">
                                        Feito por {e.PROFESSOR_NAME}
                                      </h1>
                                    </div>
                                    <div className="flex pb-3 space-x-10">
                                      <h1 className="font-semibold ">
                                        {moment(e.DATA_OBS).format("DD/MM/YYYY")}
                                      </h1>
                                    
                                    </div>
                                  </HStack>
                                  <div className={cn("bg-slate-100 p-4 rounded-lg ", e.ID_PROF === localStorage.getItem("professor_id") ? "bg-yellow-200" : "")}>
                                    <h1>{truncateText(e.OBS, 190, index)}</h1>
                                    <div className="text-end">
                                      {e.OBS.length > 200 ? (
                                        <button
                                          onClick={() => toggleShowAllText(index)}
                                          className={legendMoreLess}
                                        >
                                          {showAllText[index]
                                            ? "Mostrar menos"
                                            : "Mostrar mais"}
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              ))}
        </Stack>
      </div>
    </div>
  );
}

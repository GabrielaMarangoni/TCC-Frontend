import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../components/Sidebar";
import { divGeneral, textTitle } from "../../../../gerenciamento/alunos/styles";
import { HStack, Stack } from "@chakra-ui/react";
import { Button } from "../../../../../components/Button";
import { Modal } from "../../../../../components/Modal";
import { TextArea } from "../../../../../components/TextArea";
import { Search } from "../../../../../components/search";
import { legendMoreLess, legendStyle } from "../../styles";
import moment from "moment";
import DeleteButton from "../../../../../components/Button/buttonDelete";
import { useUser } from "../../../../../../context/loggedUser";
import { cn } from "../../../../../lib/utils";

export default function Historico() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [estudante, setEstudante] = useState([]);
  const [disciplina, setDisciplina] = useState([]);
  const [currentDisciplina, setCurrentDisciplina] = useState("");
  const [currentEstudante, setCurrentEstudante] = useState("");
  const [ano, setAno] = useState(["1º ano", "2º ano", "3º ano", "4º ano"]);
  const [observacao, setObservacao] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");
  const [myObservations, setMyObservations] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const [groupFilterOption, setGroupFilterOption] = useState("all");
  const [tabSelected, setTabSelected] = useState("1");

  async function fetchData() {
    try {
      const response = await fetch("http://localhost:3000/api/observacoes");
      const data = await response.json();

      const profId = localStorage.getItem("professor_id")
      const response2 = await fetch("http://localhost:3000/api/observacoes/all/professor/"+profId);
      const data2 = await response2.json();
      setMyObservations(data.filter((el: any) => el.ID_PROF === profId));
      setData(data2);

      const responseEstudante = await fetch("http://localhost:3000/api/estudantes");
      const estudante = await responseEstudante.json();
      setEstudante(estudante);

      await fetch("http://localhost:3000/api/not/" + profId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setShowAllText(new Array(data.length).fill(false));

      const response3 = await fetch("http://localhost:3000/api/grupos");
      let data3 = await response3.json();
      data3 = data3.filter((el: any) => el.USER_ID === localStorage.getItem("user_id"));
      setMyGroups(data3);

      initialFilters();
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  async function setEstudanteByRa(value: string) {
    const responseEstudante = await fetch(
      "http://localhost:3000/api/estudantes/" + value
    );

    const estudante = await responseEstudante.json();
    if (estudante?.body?.estudante) {
      setCurrentEstudante(estudante.body.estudante.ra);
    }
  }

  async function getDisciplinaByPeriodo(value: string) {
    const responseDisciplina = await fetch(
      "http://localhost:3000/api/disciplinas/ano/" + value
    );
    const disciplina = await responseDisciplina.json();
    setDisciplina(disciplina);
  }

  async function handleHistorico() {
    if (!currentEstudante || !currentDisciplina || !observacao) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      let json = {
        id_prof: localStorage.getItem("professor_id"),
        ra_aluno: currentEstudante,
        id_dis: currentDisciplina,
        obs: observacao,
      };
      const response = await fetch("http://localhost:3000/api/observacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });
      const responseData = await response.json();

      console.log("Resposta do backend:", responseData);
      setIsOpen(false);

      fetchData();
      setObservacao("");
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    }
  }
  
  
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  function handleOpenModal(id: string) {
    setId(id);
    setIsOpen(true);
  }

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
  async function handleDeleteObservation(id: any) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/observacoes/${id}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();

      console.log("Resposta do backend:", responseData);
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir observação:", error);
    }
  }

  const initialFilters = () => {
    if (router.query.filter) {
      setFilterOption(router.query.filter as string);
    }

    if (router.query.group) {
      setGroupFilterOption(router.query.group as string);
    }
  }

  useEffect(() => {
    setHydrated(true);
    fetchData();
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <div>
      <Sidebar />

      <div className="w-4/5 bg-white ml-80 px-32 pt-24">
        <HStack justifyContent="space-between">
          <h1 className={textTitle}>Minhas observações</h1>

          <Button
            onClick={() => handleOpenModal("")}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-72"
            h="h-12"
            textColor="text-black"
            textWeight="font-semibold"
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
            <fieldset className=" bg-Input2 w-full  rounded-lg">
              <legend className={legendStyle}>
                Selecione o nome do aluno(a)
              </legend>
              <select
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  setEstudanteByRa(selectedValue);
                }}
                className="bg-Input2 w-full h-10 bg-optionWhite text-sm px-4 rounded-lg pb-2 outline-none"
              >
                <option key="init">Selecione o nome do aluno(a)</option>
                {estudante.length > 0 &&
                  estudante.map((e: any) => (
                    <option key={e.RA} value={e.RA}>
                      {e.NAME}
                    </option>
                  ))}
              </select>
            </fieldset>
            <HStack
              justifyContent="space-between "
              alignItems="flex-start"
              className="pt-3"
            >
              <fieldset className=" bg-Input2 w-full  rounded-lg">
                <legend className={legendStyle}>Selecione um período</legend>
                <select
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    console.log("ONCHANGE");
                    getDisciplinaByPeriodo(selectedValue);
                  }}
                  className="bg-Input2 w-full h-10 bg-optionWhite text-sm px-4 rounded-lg pb-2 outline-none"
                >
                  <option key="init">Selecione o período</option>
                  {ano.length > 0 &&
                    ano.map((e: any) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                </select>
              </fieldset>
              <fieldset className=" bg-Input2 w-full  rounded-lg">
                <legend className={legendStyle}>Selecione a disciplina</legend>
                <select
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setCurrentDisciplina(selectedValue);
                  }}
                  className="bg-Input2 w-full h-10 bg-optionWhite text-sm px-4 rounded-lg pb-2 outline-none"
                >
                  <option key="init">Selecione a disciplina</option>
                  {disciplina.length > 0 &&
                    disciplina.map((e: any) => (
                      <option key={e.ID_DIS} value={e.ID_DIS}>
                        {e.NOME_DIS}
                      </option>
                    ))}
                </select>
              </fieldset>
            </HStack>

            <div className="pt-2">
              <TextArea
                haslabel
                label="Observação"
                placeholder="Digite a observação"
                top="mt-2"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
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
        <div className="pt-8">
          <Search haslabel label="" text={text} setText={(value) => setText(value)} search/>
        </div>
      </div>
      <div className={divGeneral}>
        <div className="pb-20">
          <Stack spacing={5}>
          <Stack spacing={5} className="overflow-y-auto">
            <div className="flex space-x-3 pt-4 ">

              <h1 className="font-bold text-lg ">Filtrar por </h1>
              <div className="w-1/4">
                <select  
                  className="bg-Input2 text-[15px] w-full h-10 bg-optionWhite text-sm px-4 rounded-lg pb-2 outline-none"
                  value={filterOption}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setFilterOption(selectedValue);
                  }}
                >
                  <option value="all"> Observações de todos os alunos</option>
                  <option value="groups"> Observações dos meus grupos</option>
                  
                </select>
              </div>
              <div className="w-1/4">
                {filterOption === "groups" && (
                  <select  
                    className="bg-Input2 text-[15px] w-full h-10 bg-optionWhite text-sm px-4 rounded-lg pb-2 outline-none"
                    value={groupFilterOption}
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      setGroupFilterOption(selectedValue);
                    }}
                  >
                    <option key="init" value="all">Todos os grupos</option>
                    {myGroups.length > 0 && (myGroups.map((e: any) => {
                      return (
                        <option key={e.ID} value={e.ID}>
                        {e.NAME}
                      </option>
                      )
                    }))}
                  </select>
                )}
              </div>
            </div>



            {data.filter((el: any) => {
              if(filterOption === "all") {
                return el
              } else if(filterOption === "groups") {
                if(groupFilterOption === "all") {
                  if (el.ESTUDANTE.GRUPO_ESTUDANTES.length > 0) {
                    const myGroups = el.ESTUDANTE.GRUPO_ESTUDANTES.filter((el: any) => {
                      const grupo = el.GRUPO.USER.PROFESSOR[0].ID === localStorage.getItem("professor_id")
                      if (grupo) {
                        return grupo
                      }
                    })
                    if(myGroups.length > 0) {
                      return el
                    }
                  }
                } else {
                  if (el.ESTUDANTE.GRUPO_ESTUDANTES.length > 0) {
                    const myGroups = el.ESTUDANTE.GRUPO_ESTUDANTES.filter((el: any) => {
                      const grupo = el.GRUPO.USER.PROFESSOR[0].ID === localStorage.getItem("professor_id")
                      if (grupo) {
                        return grupo
                      }
                    })
                    if(myGroups.length > 0) {
                      console.log(myGroups)
                      console.log(groupFilterOption)
                      const toReturn = myGroups.filter((el: any) => el.GRUPO_ID === groupFilterOption)
                      if(toReturn.length > 0) {
                        return el
                      }
                    }
                  }
                }
              }
            }).filter((el: any) => text.length ? el.OBS.toLowerCase().indexOf(text.toLowerCase()) !== -1 : el).map((e: any, index: number) => (
                <div className={cn("border-2 border-button p-5 rounded-xl", e.ID_PROF === localStorage.getItem("professor_id") ? "bg-yellow-100" : "")}>
                  <HStack justifyContent="space-between">
                    <div
                      className=" flex space-x-16 pb-3  "
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <h1 className="font-semibold ">{e.ESTUDANTE.NAME}</h1>
                      <h1 className="font-semibold  ">
                        {e.DISCIPLINA.NOME_DIS} - {e.DISCIPLINA.ANO_DIS} (
                        {moment(e.DATA_OBS).format("YYYY")})
                      </h1>
                      <h1 className="font-semibold  ">
                        Feito por {e.PROFESSOR.NAME}
                      </h1>
                    </div>
                    <div className="flex pb-3 space-x-10">
                      {e.ESTUDANTE.GRUPO_ESTUDANTES.length > 0 && e.ESTUDANTE.GRUPO_ESTUDANTES.filter((el: any) => {
                        const grupo = el.GRUPO.USER.PROFESSOR[0].ID === localStorage.getItem("professor_id")
                        if (grupo) {
                          return grupo
                        }
                      }).map((grupo: any) => (
                        <h1 className="bg-amarelo rounded-xl px-3 py-1 ">
                          {grupo.GRUPO.NAME}
                        </h1>
                      ))}
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
              {data.filter((el: any) => {
              console.log(filterOption)
              console.log(groupFilterOption)
              if(filterOption === "all") {
                return el
              } else if(filterOption === "groups") {
                if(groupFilterOption === "all") {
                  if (el.ESTUDANTE.GRUPO_ESTUDANTES.length > 0) {
                    const myGroups = el.ESTUDANTE.GRUPO_ESTUDANTES.filter((el: any) => {
                      const grupo = el.GRUPO.USER.PROFESSOR[0].ID === localStorage.getItem("professor_id")
                      if (grupo) {
                        return grupo
                      }
                    })
                    if(myGroups.length > 0) {
                      return el
                    }
                  }
                } else {
                  if (el.ESTUDANTE.GRUPO_ESTUDANTES.length > 0) {
                    const myGroups = el.ESTUDANTE.GRUPO_ESTUDANTES.filter((el: any) => {
                      const grupo = el.GRUPO.USER.PROFESSOR[0].ID === localStorage.getItem("professor_id")
                      if (grupo) {
                        return grupo
                      }
                    })
                    if(myGroups.length > 0) {
                      console.log(myGroups)
                      console.log(groupFilterOption)
                      const toReturn = myGroups.filter((el: any) => el.GRUPO_ID === groupFilterOption)
                      if(toReturn.length > 0) {
                        return el
                      }
                    }
                  }
                }
              }
            }).filter((el: any) => text.length ? el.OBS.toLowerCase().indexOf(text.toLowerCase()) !== -1 : el).length === 0 && (
              <h1 className="col-span-3 text-gray-500 text-center font-semibold text-2xl pt-10">Nenhuma observação encontrada</h1>
            )}
          </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
}
function fetchData() {
  throw new Error("Function not implemented.");
}

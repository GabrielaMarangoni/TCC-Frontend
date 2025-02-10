import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { divGeneral, textTitle } from "../../geral/alunos/styles";
import { HStack, Stack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";
import { legendMoreLess, legendStyle } from "../../geral/observacao/styles";
import DeleteButton from "../../../components/Button/buttonDelete";
import EditButton from "../../../components/Button/buttonEdit";
import moment from "moment";
import { io, Socket } from "socket.io-client";

export default function Grupos() {
  const [estudante, setEstudante] = useState([]);
  const [selectEstudante, setSelectEstudante] = useState([]);
  const [createGrupo, setCreateGrupo] = useState(true);
  const [grupoEdit, setGrupoEdit] = useState({});
  const [data, setData] = useState([]);
  const selectRef = useRef(null);
  const [name, setName] = useState("");
  const [temNotificacao, setTemNotficacao] = useState([{id: 0, notificacao: 0, estudantes: []}]);
  const [text, setText] = useState("")
  const [isEdit, setIsEdit] = useState(false);
  const [nn, setNn] = useState<any[]>([])

  const [hydrated, setHydrated] = useState(false);

  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(id: any) {
    setId(id);
    setIsOpen(true);
  }

  async function getGroups() {
    const response = await fetch("http://localhost:3000/api/grupos");
    let data = await response.json();
    const toNot: any = []
    data.forEach((e: any) => toNot.push({id: e.ID, notificacao: 0, estudantes: e.ESTUDANTES}))
    data = data.filter((el: any) => el.USER_ID === localStorage.getItem("user_id"));
    setData(data);
    setTemNotficacao(toNot);

    const responseEstudante = await fetch(
      "http://localhost:3000/api/estudantes/"
    );
    const estudante = await responseEstudante.json();
    setEstudante(estudante);
    
    const result: any[] = [];
    data.forEach((d: any) => {
      result.push({ groupId: d.ID, notCount: 0 })
    })

    const alreadyAdd: any = []

    estudante.forEach((e: any) => {
      e.GRUPO_ESTUDANTES.forEach((g: any) => {
        const groupId = g.GRUPO_ID;
        const group = result.find((r: any) => r.groupId === groupId);
        if (group) {
          e.OBSERVACAO.forEach((o: any) => {
            o.NOTIFICACOES.forEach((n: any) => {
              if (!n.LIDA && n.ID_PROF === localStorage.getItem("professor_id")) {
                if (!alreadyAdd.includes(n.ID)) {
                  group.notCount++;
                  alreadyAdd.push(n.ID)
                }
              }
            })
          })
        }
      })
    })
   

    setNn(result);
  }

  const [showAllText, setShowAllText] = useState(false);
  function truncateText(text: any, maxLength: any) {
    if (!text) return "";
    if (!showAllText && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  }

  function handleButtonGroup(groupId: any) {
    router.push("/gerenciamento/grupos/grupo?ID=" + groupId);
  }

  async function handleDeleteGroup(groupId: any) {
    try {
      const response = await fetch("http://localhost:3000/api/grupos/" + groupId, {
        method: "DELETE",
      });

      if (response.ok) {
        getGroups();
      } else {
        alert("Erro ao excluir grupo");
      }
    } catch (error) {
      alert("Erro ao excluir grupo");
    }
  }

  const handleAddEstudante = () => {
    const selectedValue = selectRef.current.value;
    const estudanteClick = estudante.find((e: any) => e.RA == selectedValue);
    if (
      estudanteClick &&
      !selectEstudante.find((e: any) => e.RA == selectedValue)
    ) {
      setSelectEstudante((prevState) => [...prevState, estudanteClick]);
    }
    selectRef.current.value = "";
  };

  const handleRemoveEstudante = (ra: any) => {
    setSelectEstudante((prevState) =>
      prevState.filter((e: any) => e.RA !== ra)
    );
  };

  const handleSaveGroup = async () => {
    if (!name.trim() || selectEstudante.length === 0) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }
    let json;

    if (createGrupo) {
      json = {
        name: name,
        ra_alunos: selectEstudante.map((e: any) => e.RA),
        user_id: localStorage.getItem("user_id"),
      };

      try {
        const response = await fetch("http://localhost:3000/api/grupo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });

        if (response.ok) {
          setName("");
          setSelectEstudante([]);
          getGroups();
          setIsOpen(false);
        } else {
          console.error("Erro ao cadastrar grupo:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao cadastrar grupo:", error);
      }
    } else {
      let json = {
        name: name,
        ra_alunos: selectEstudante.map((e: any) => e.RA),
      };

      try {
        const response = await fetch(
          "http://localhost:3000/api/grupos/" + grupoEdit.ID,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
          }
        );

        if (response.ok) {
          setName("");
          setSelectEstudante([]);
          setCreateGrupo(true);
          getGroups();
          setIsOpen(false);
        } else {
          console.error("Erro ao editar grupo:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao editar grupo:", error);
      }
    }
  };

  const fetchData = async () => {
    await getGroups();
  }

  useEffect(() => {
    const initializeSocket = async () => {
      await fetchData();
      const socket: Socket = io("http://localhost:3000");

      socket.on('newNotification', async () => {
        await fetchData();
      });
    }

    setHydrated(true);
    initializeSocket();
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchData();
    }

    init();
  }, [])

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  return (
    <div>
      <Sidebar />
      <div className={divGeneral}>
        <HStack justifyContent="space-between">
          <h1 className={textTitle}>Grupos para monitoramento</h1>
          <Button
            bg="bg-button"
            rounded="rounded-lg"
            w="w-72"
            h="h-full"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="CRIAR GRUPO"
            onClick={() => handleOpenModal("")}
          />
        </HStack>
        <div className="pt-10 w-full pb-10">
          <Search haslabel label="" text={text} setText={(value) => setText(value)} search/>
        </div>
        <Modal
          isOpen={isOpen}
          footer={undefined}
          onClose={() => {
            setName("");
            setSelectEstudante([]);
            setIsOpen(false);
            setIsEdit(false);
          }}
          title={isEdit ? "Editar grupo" : "Criar um grupo para monitoramento"}
          size="3xl"
        >
          <Input
            haslabel
            name="grupo"
            label="Nome do grupo"
            placeholder="ex: Grupo 1"
            value={name}
            onChange={(e) => setName(e.target.value)}

          />
          <div className="flex justify-center space-x-5 pb-5">
            <div className="flex space-x-5 pt-3 w-full">
              <fieldset className="bg-Input2 w-full rounded-lg">
                <legend className={legendStyle}>
                  Selecione o nome do aluno(a)
                </legend>
                <select
                  ref={selectRef}
                  className="bg-Input2 w-full h-10 bg-optionWhite text-sm px-4 rounded-lg pb-2 outline-none"
                >
                  <option key="init" value="">
                    Selecione o nome do aluno(a)
                  </option>
                  {estudante.length > 0 &&
                    estudante.map((e: any) => (
                      <option key={e.RA} value={e.RA}>
                        {e.NAME}
                      </option>
                    ))}
                </select>
              </fieldset>
              <div className="pt-3">
                <Button
                  bg="bg-button"
                  rounded="rounded-lg"
                  w="w-16"
                  textColor="text-black"
                  textWeight="font-bold"
                  formAction="submit"
                  label="OK"
                  onClick={handleAddEstudante}
                />
              </div>
            </div>
          </div>
          <div className="bg-Input h-48 min-h-48 max-h-48 overflow-auto pt-3 p-3 pb-3">
            <table className="w-full">
              <tbody>
                {selectEstudante.length > 0 &&
                  selectEstudante.map((e: any) => (
                    <tr key={e.RA}>
                      <td className="flex items-center justify-between">
                        <h1 className="text-base px-1">{e.NAME}</h1>
                        <button
                          className="text-end hover:text-warning"
                          onClick={() => handleRemoveEstudante(e.RA)}
                        >
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="far"
                            data-icon="trash-alt"
                            className="h-6 w-6"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              fill="currentColor"
                              d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="pt-10">
            <Button
              bg="bg-button"
              rounded="rounded-lg"
              w="w-full"
              textColor="text-black"
              textWeight="font-bold"
              formAction="submit"
              label="SALVAR"
              onClick={() => handleSaveGroup()}
            />
          </div>
        </Modal>

        <div className="grid grid-cols-3 gap-5">
  {data.length === 0 ? (
    <div className="col-span-3 text-center text-gray-500 text-lg">
      Nenhum grupo criado
    </div>
  ) : (
    data
      .filter((el: any) => text.length > 0 ? el.NAME.toLowerCase().includes(text.toLowerCase()) : el)
      .map((e: any) => (
        <div key={e.ID}>
          <Stack className="border-2 border-button pt-5 px-5 rounded-xl">
            <HStack justifyContent="space-between">
              <div className="flex space-x-3">
                <h1 className="font-bold text-2xl">
  {e.NAME.length > 30 ? e.NAME.slice(0, 30) + "..." : e.NAME}
</h1>
              </div>
              <div className="flex space-x-3">
                <EditButton
                  onClick={() => {
                    setIsEdit(true);
                    setGrupoEdit(e);
                    setCreateGrupo(false);
                    setName(e.NAME);
                    setSelectEstudante(e.ESTUDANTES);
                    handleOpenModal("");
                  }}
                />
                <DeleteButton onClick={() => handleDeleteGroup(e.ID)} />
              </div>
            </HStack>

            <div className="bg-slate-100 p-4 rounded-lg h-36 min-h-36 max-h-36">
              {e.ESTUDANTES.slice(0, 3).map((estudante: any) => (
                <React.Fragment key={estudante.RA}>
                  <h1 className="text-lg">{estudante.NAME}</h1>
                  <div className="border-t border-gray-300"></div>
                </React.Fragment>
              ))}
              <div>
                <button
                  onClick={() => handleButtonGroup(e.ID)}
                  className={legendMoreLess}
                >
                  Mostrar mais
                </button>
              </div>
            </div>

            <HStack justifyContent="space-between">
              <div>
                <h1 className="font-semibold">
                  Número de alunos: {e.SOMA_ESTUDANTES}
                </h1>
              </div>
              <h1 className="font-bold">
                {moment(Date.parse(e.CREATED_AT)).format("DD/MM/YYYY")}
              </h1>
            </HStack>
          </Stack>
        </div>
      ))
  )}
</div>

      </div>
    </div>
  );
}

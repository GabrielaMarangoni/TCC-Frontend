import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import router from "next/router";

import { HStack } from "@chakra-ui/react";
import { TColumn } from "../../../../components/Table/TColumn";
import { Button } from "../../../../components/Button";
import Sidebar from "../../../../components/Sidebar";
import { divGeneral, textTitle } from "../../alunos/styles";
import TableBase from "../../../../components/TableGroup/TableBase";
import TPagination from "../../../../components/TableGroup/TPagination";
import { Modal } from "../../../../components/Modal";
import { Select } from "../../../../components/Select";
import { TextArea } from "../../../../components/TextArea";
import { legendStyle } from "../../../geral/observacao/styles";
import DeleteButton from "../../../../components/Button/buttonDelete";
import { ChevronLeft } from "lucide-react";
import { Input } from "../../../../components/Input";

export default function Grupo() {
  const [group, setGroup] = useState({
    NAME: "",
    SOMA_ESTUDANTES: 0,
    ESTUDANTES: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const router = useRouter();
  const [disciplina, setDisciplina] = useState([]);
  const [ano, setAno] = useState(["1º ano", "2º ano", "3º ano", "4º ano"]);
  const [observacao, setObservacao] = useState("");
  const [id, setId] = useState("");
  const [currentDisciplina, setCurrentDisciplina] = useState("");
  const [currentEstudante, setCurrentEstudante] = useState([]);
  const [isOpenDangerous, setIsOpenDangerous] = useState(false);
  const [ra, setRa] = useState("");

  const [estudante, setEstudante] = useState([]);
  const [selectEstudante, setSelectEstudante] = useState([]);
  const [createGrupo, setCreateGrupo] = useState(true);
  const [grupoEdit, setGrupoEdit] = useState({});
  const [data, setData] = useState([]);
  const selectRef = useRef(null);
  const [name, setName] = useState("");
  const [stname, setStname] = useState("");


  function handleOpenModal(ra: string) {
    setRa(ra);
    setIsOpen(true);
  }
  

  async function getGroup(id: any) {
    console.log("getGroup: ");
    const response = await fetch("http://localhost:3000/api/grupo/" + id);

    if (response.status == 404) {
      return router.push("/gerenciamento/grupos/");
    }

    const data = await response.json();
    console.log("json: ", data);
    setGroup({
      NAME: data.body.grupo.NAME,
      SOMA_ESTUDANTES: data.body.grupo.SOMA_ESTUDANTES,
      ESTUDANTES: data.body.grupo.alunos,
    });

    setCurrentEstudante(data.body.grupo.alunos.map((e: any) => e.RA));
  }

  useEffect(() => {
    async function fetchData() {
      try {
        if (!router.isReady) return;
        
        await getGroup(router.query.ID);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, [router.isReady]);

  async function handleDeleteStudant(ra: any, confirmDangerous: boolean) {
    setRa(ra);

    if (
      !confirmDangerous &&
      currentEstudante.filter((e: any) => e != ra).length == 0
    ) {
      setIsOpenDangerous(true);
      return;
    }

    let json = {
      name: group.NAME,
      ra_alunos: currentEstudante.filter((e: any) => e != ra),
    };

    console.log("request json: ", json);

    try {
      const response = await fetch(
        `http://localhost:3000/api/grupos/${router.query.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        }
      );
      if (response.ok) {
        getGroup(router.query.ID);
        setRa("");
      } else {
        console.error("Erro ao excluir aluno:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
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
    let json;

    console.log(grupoEdit)

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
          "http://localhost:3000/api/grupos/" + router.query.ID,
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
          setIsOpenEdit(false);
          router.push("/gerenciamento/grupos/");
        } else {
          console.error("Erro ao editar grupo:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao editar grupo:", error);
      }
    }
  };


  const columns: TColumn[] = [
    {
      header: "",
      acessor: "id",
      renderer: (id: string, obj: any) => {
        // console.log("delete", id);
        return (
          <div className="flex justify-center px-2">
            {/*  <button className="bg-warning  hover:bg-warningHover w-10 h-10 rounded-lg flex items-center justify-center">
              <i className="ri-delete-bin-fill ri-xl"></i>
            </button> */}
            <DeleteButton onClick={() => handleDeleteStudant(obj.RA, false)} />
          </div>
        );
      },
    },
    {
      header: "RA",
      acessor: "RA",
    },
    {
      header: "Nome",
      acessor: "NAME",
    },
    {
      header: "Observações",
      acessor: "COUNT",
    },

    {
      header: "",
      acessor: "id",
      renderer: (id: string, obj: any) => {
        return (
          <div className="space-x-5 flex justify-end px-3">
            <button 
              onClick={() => {
                router.push(`/geral/alunos/historico?RA=${obj.RA}`);
              }}
              className="h-8 underline hover:bg-divX rounded-lg text-black font-semibold px-2">
              VER OBSERVAÇÕES
            </button>
            <button
              onClick={() => {
                setStname(obj.NAME);
                handleOpenModal(obj.RA);
              }}
              className=" h-8 bg-button hover:bg-divX rounded-lg text-black font-semibold px-2"
            >
              NOVA OBSERVAÇÃO
            </button>
          </div>
        );
      },
    },
  ];

  async function getDisciplinaByPeriodo(value: string) {
    console.log("getDisciplinaByPeriodo: ", value);
    const responseDisciplina = await fetch(
      "http://localhost:3000/api/disciplinas/ano/" + value
    );
    const disciplina = await responseDisciplina.json();
    setDisciplina(disciplina);
  }
  async function handleHistorico() {
    if (!ra) {
      alert("Selecione um aluno");
      return;
    }

    if (!currentDisciplina) {
      alert("Selecione uma disciplina");
      return;
    }

    if (!observacao) {
      alert("Digite uma observação");
      return;
    }

    try {
      let json = {
        id_prof: localStorage.getItem("professor_id"),
        ra_aluno: ra,
        id_dis: currentDisciplina,
        obs: observacao,
      };

      console.log('JSON: ', json)
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
      setObservacao("");
      setRa("");
      getGroup(router.query.ID);
    } catch (error) {
      console.error("Erro ao salvar observação:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const responseEstudante = await fetch(
          "http://localhost:3000/api/estudantes/"
        );
        const estudante = await responseEstudante.json();
        setEstudante(estudante);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Sidebar />
      <Modal
        isOpen={isOpen}
        footer={undefined}
        onClose={() => setIsOpen(false)}
        title="Adicionar uma observação "
        size="3xl"
      >
        <h1  className="text-2xl rounded-md bg-Input2 font-bold px-3 py-2">{stname}</h1>
            
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

        <div className="pt-3">
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

      <Modal
        isOpen={isOpenDangerous}
        onClose={() => setIsOpenDangerous(false)}
        title="Ao retirar todos os alunos, o grupo será excluído. Deseja continuar?"
        size="3xl"
        footer={undefined}
      >
        <div className="pt-10">
          <Button
            onClick={() => {
              handleDeleteStudant(ra, true);
            }}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-full"
            h="h-14"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="CONFIRMAR"
          />
          <Button
            onClick={() => setIsOpenDangerous(false)}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-full"
            h="h-14"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="CANCELAR"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isOpenEdit}
        footer={undefined}
        onClose={() => {
          setName("");
          setSelectEstudante([]);
          setIsOpenEdit(false);
        }}
        title={"Editar grupo"}
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

      <div className={divGeneral}>
        <HStack justifyContent="space-between">
          <div className="flex gap-2 items-center">
            <button 
              className="bg-slate-200 hover:bg-amarelo rounded-lg w-10 h-10 flex items-center justify-center"
              onClick={() => router.push("/gerenciamento/grupos/")}
            >
              <ChevronLeft/>
            </button>
            <div className="px-3">
              <h1 className={textTitle}>{group.NAME}</h1>
              <h1 className="text-lg text-semibold underline ">
                {group.SOMA_ESTUDANTES} participantes
              </h1>
            </div>
          </div>

          <div>
            <Button
              bg="bg-button"
              rounded="rounded-lg"
              w="w-40"
              textColor="text-black"
              textWeight="font-bold"
              formAction="submit"
              label="EDITAR GRUPO"
              onClick={() => {
                setGrupoEdit(group)
                setCreateGrupo(false);
                setName(group.NAME);
                setSelectEstudante(group.ESTUDANTES);
                setIsOpenEdit(true);
              }}
            />
          </div>
        </HStack>

        <div className="pt-10">
          <TableBase
            columns={columns}
            data={group.ESTUDANTES}
            editable={false}
            uniqueKey={"id"}
            setData={function (value: any): void {
              throw new Error("Function not implemented.");
            }}
            selecteds={[]}
            setSelecteds={function (value: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </div>
    </div>
  );
}
function fetchData() {
  throw new Error("Function not implemented.");
}

import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { HStack } from "@chakra-ui/react";
import { Button } from "../../../components/Button";
import { Search } from "../../../components/search";
import { divGeneral, textTitle } from "../alunos/styles";
import { TColumn } from "../../../components/Table/TColumn";
import TableBase from "../../../components/Table/TableBase";
import { METHODS } from "http";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";

export default function Alunos() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [text, setText] = useState("");

  async function fetchData() {
    try {
      const response = await fetch('http://localhost:3000/api/professors/', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',         
        },
        mode: 'cors', 
        credentials: 'same-origin', 
      });
      
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }


  useEffect(() => {
    fetchData();
    setHydrated(true);
  }, []);

  async function handleDelete(id: string) {
    try {
      console.log("ID do professor CIMA:", id); 
      const response = await fetch(`http://localhost:3000/api/professors/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error("Erro ao excluir professor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
    }
  }
  
  function openRegister() {
    router.push("/gerenciamento/professores/opcao");
  }

  const columns: TColumn[] = [
    {
      header: "Nome",
      acessor: "NAME",
    },
    {
      header: "Link",
      acessor: "link",
    },
    {
      header: "",
      acessor: "",
      renderer: (id: string, obj: any) => {
        return (
          <div className="space-x-5 flex justify-end">
            <Button
              onClick={() => handleOpenModalEdit("")}
               
              bg={"bg-button"}
              icon={"ri-edit-box-fill"}
            />
            <Button
              onClick={() => {
                console.log("ID do professor AQUI:", obj.USER_ID); 
                handleDelete(obj.USER_ID);
              }}
              bg={"bg-warning"}
              icon={"ri-delete-bin-fill"}
            />
          </div>
        );
      },
    },
  ];
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  function handleOpenModalEdit(id: string) {
    setId(id);
    setIsOpen(true);
  }

  if (!hydrated) {
    return null
  }

  return (
    <div>
      <Sidebar />
      <div className={divGeneral}>
        <HStack justifyContent="space-between">
          <h1 className={textTitle}>Horário dos professores</h1>
          <Button
            onClick={openRegister}
            bg="bg-button"
            rounded="rounded-lg"
            w="w-72"
            h="h-full"
            textColor="text-black"
            textWeight="font-bold"
            formAction="submit"
            label="CADASTRAR"
          />
        </HStack>

        <div className="pt-10 w-full pb-10">
          <Search haslabel label="" text={text} setText={(value) => setText(value)} search/>
        </div>

        <TableBase
          columns={columns}
          data={text.length > 0 ? data.filter((v: any) => v.NAME.toLowerCase().indexOf(text.toLowerCase()) !== -1) : data || []}
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
      <Modal
                isOpen={isOpen}
                footer={undefined}
                onClose={() => setIsOpen(false)}
                title="Edite o link do professor(a) "
                size="3xl"
              >
                <div className="flex flex-col  space-y-5 ">
                  <Input
                    haslabel
                    name="edit"
                    label="Novo link:"
                    placeholder="Novo link"
                    type="edit"
                    value={""}
                  />
                  <Button
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
              </Modal>
    </div>
  );
}

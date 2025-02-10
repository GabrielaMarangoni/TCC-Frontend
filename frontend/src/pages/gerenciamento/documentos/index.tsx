import router from "next/router";
import React, { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import Sidebar from "../../../components/Sidebar";
import { Document } from "../../../components/Document";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { Input } from "../../../components/Input";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const getDocuments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/documentos");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  const saveDocument = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/documentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          link,
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        setTitle("");
        setDescription("");
        setLink("");
        await getDocuments();
      } else {
        console.error("Erro ao salvar documento:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao salvar documento:", error);
    }
  }

  useEffect(() => {
    getDocuments();
  }, [])
   
  useEffect(() => {
    setHydrated(true);
  }, [])

  if (!hydrated) {
    return null;
  }

  return (
    <div >
      <Sidebar />

      <div className="min-w-[calc(100vw-20rem)] max-w-min w-full flex justify-between items-center ml-80 pt-20 pb-5 px-20">
        <h1 className="font-semibold text-4xl">Documentos</h1>
        <Button
          onClick={() => setIsOpen(true)}
          className="w-fit p-0 px-4 py-2 bg-button rounded-lg h-10 text-black font-bold text-base"
          formAction="submit"
          label="Cadastrar documento"
        />
        <Modal
          isOpen={isOpen}
          footer={undefined}
          onClose={() => setIsOpen(false)}
          title="Cadastrar documento"
          size="3xl"
        >
          <VStack justifyContent="space-between">
            <Input
              haslabel
              name="title"
              label="Título do documento:"
              placeholder="Digite o título aqui"
              type="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              haslabel
              name="description"
              label="Descrição do documento:"
              placeholder="Digite a descrição aqui"
              type="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              haslabel
              name="link"
              label="Link:"
              placeholder="Digite o link aqui"
              type="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </VStack>

          <div className="pt-10">
            <Button
              onClick={async () => await saveDocument()}
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
      </div>

      <div className="w-[calc(100vw-20rem)] flex flex-col justify-start ml-80">
        <div className="grid grid-cols-5 gap-4 px-20 pb-20 max-w-7xl items-center">
          {data.map((document: any) => (
            <Document 
              key={document.ID}
              title={document.TITULO}
              description={document.DESCRICAO}
              url={document.LINK}
            />
          ))}
           {data.length === 0 && (
            <h1 className="col-span-3 text-start text-gray-500 text-lg">Nenhum documento cadastrado</h1>
          )}
        </div>
      </div>
    </div>
  );
}

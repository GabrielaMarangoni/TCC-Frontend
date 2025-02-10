import router from "next/router";
import React, { useEffect, useState } from "react";
import { VStack } from "@chakra-ui/react";
import Sidebar from "../../../components/Sidebar";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [calendarLink, setCalendarLink] = useState(""); // Estado para armazenar o link

  async function getCalendario() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/last/calendario");
      const data = await response.json();
      
      if (data.body && data.body.calendario) {
        setCalendarLink(data.body.calendario.LINK); // Salva o link no estado
      }
    } catch (error) {
      console.error("Erro ao buscar calendário:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCalendario();
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Abre o link apenas se houver um calendário e ele ainda não foi aberto
  useEffect(() => {
    if (calendarLink) {
      window.open(calendarLink, "_blank");
    }
  }, [calendarLink]);

  if (!hydrated) {
    return null;
  }

  return (
    <div>
      <Sidebar />

      <div className="w-[calc(100vw-20rem)] h-screen flex flex-col items-center justify-center ml-80">
        {loading ? (
          <h1>Abrindo o calendário atual...</h1>
        ) : calendarLink ? (
          <h1 className="text-2xl">Calendário aberto! Para reabrir, atualize a página!</h1>
        ) : (
          <h1 className="text-2xl">Nenhum calendário cadastrado</h1>
        )}
      </div>
    </div>
  );
}

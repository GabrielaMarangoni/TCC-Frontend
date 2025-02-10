import router from "next/router";
import React, { useState, useEffect } from "react";
import { HStack } from "@chakra-ui/react";
import Sidebar from "../../../components/Sidebar";
import { textTitle } from "../alunos/styles";
import DashboardGrupos from "../../../components/Dashboard/grupos";
import DashboardAlunos from "../../../components/Dashboard/alunos";
import { io, Socket } from "socket.io-client";
import DashboardAlunosGeral from "../../../components/Dashboard/alunosGerais";

export default function Dashboard() {
  const [alunos, setAlunos] = useState([]);
  const [alunos2, setAlunos2] = useState([]);
  const [alunos3, setAlunos3] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [temNotificacao, setTemNotificacao] = useState([]);

  const getNotifications = async () => {
    const response = await fetch('http://localhost:3000/api/not/' + localStorage.getItem("professor_id"));
    const dataRes = await response.json();
    console.log(dataRes)
    setTemNotificacao(dataRes)
  }

  const getAlunos = async () => {
    try {
      const responsea = await fetch('http://localhost:3000/api/grupos/');
      let dataa = await responsea.json();
      dataa = dataa.filter((grupo: any) => grupo.USER_ID === localStorage.getItem("user_id"));
      console.log(dataa.map((el: any) => el.ID))

      const responseAA = await fetch('http://localhost:3000/api/estudantes/');
      const dataAA = await responseAA.json();
      setAlunos(dataAA);

      const response = await fetch('http://localhost:3000/api/observacoes/last/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupsIds: dataa.map((el: any) => el.ID) }),
      });
      const data = await response.json();
      setAlunos2(data);

      const response1 = await fetch('http://localhost:3000/api/observacoes/last/geral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data1 = await response1.json();
      setAlunos3(data1);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  const getProfessores = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/professors/');
      let data = await response.json();
      setProfessores(data.filter((el: any) => el.IS_COORD === false));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  const getDisciplinas = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/disciplinas/');
      const data = await response.json();
      setDisciplinas(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  const getGrupos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/grupos/');
      let data = await response.json();
      data = data.filter((grupo: any) => grupo.USER_ID === localStorage.getItem("user_id"));
      console.log(data)
      setGrupos(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  useEffect(() => {
    const initializeSocket = async () => {
      await getNotifications();
      const socket: Socket = io("http://localhost:3000");

      socket.on('newNotification', async () => {
        await getAlunos();
      });
    }

    setHydrated(true);
    initializeSocket();
    getAlunos();
    getProfessores();
    getDisciplinas();
    getGrupos();
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="h-screen bg-Input2">
      <Sidebar />

      <div className='flex flex-col ml-80 p-32 h-full min-h-screen pt-10'>
        <HStack className="space-x-3 ">
          <div className="flex space-x-2 bg-amarelo p-3 rounded-2xl	w-1/3">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="trash-alt"
              className="h-12 w-12"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2 0 9 12 16 22 10.1667V17.5H24V9L12 2ZM3.99902 13.4905V18.0001C5.82344 20.429 8.72812 22.0001 11.9998 22.0001 15.2714 22.0001 18.1761 20.429 20.0005 18.0001L20.0001 13.4913 12.0003 18.1579 3.99902 13.4905Z"></path>
            </svg>
            <h1 className={textTitle}>ALUNOS: {alunos.length}</h1>
          </div>

          <div className="flex space-x-2 bg-amarelo p-3 rounded-2xl	w-1/3">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="trash-alt"
              className="h-12 w-12"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 10C14.2091 10 16 8.20914 16 6 16 3.79086 14.2091 2 12 2 9.79086 2 8 3.79086 8 6 8 8.20914 9.79086 10 12 10ZM5.5 13C6.88071 13 8 11.8807 8 10.5 8 9.11929 6.88071 8 5.5 8 4.11929 8 3 9.11929 3 10.5 3 11.8807 4.11929 13 5.5 13ZM21 10.5C21 11.8807 19.8807 13 18.5 13 17.1193 13 16 11.8807 16 10.5 16 9.11929 17.1193 8 18.5 8 19.8807 8 21 9.11929 21 10.5ZM12 11C14.7614 11 17 13.2386 17 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5 15.9999C5 15.307 5.10067 14.6376 5.28818 14.0056L5.11864 14.0204C3.36503 14.2104 2 15.6958 2 17.4999V21.9999H5V15.9999ZM22 21.9999V17.4999C22 15.6378 20.5459 14.1153 18.7118 14.0056 18.8993 14.6376 19 15.307 19 15.9999V21.9999H22Z"></path>
            </svg>
            <h1 className={textTitle}>PROFESSORES: {professores.length || 0}</h1>
          </div>

          <div className="flex space-x-2 bg-amarelo p-3 rounded-2xl	w-1/3">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="trash-alt"
              className="h-12 w-12"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >        
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M5 18V20H9V18H5ZM3 7L7 2L11 7V22H3V7ZM21 8H19V10H21V12H18V14H21V16H19V18H21V21C21 21.5523 20.5523 22 20 22H14C13.4477 22 13 21.5523 13 21V5C13 4.44772 13.4477 4 14 4H20C20.5523 4 21 4.44772 21 5V8Z"></path>
            </svg>
            <h1 className={textTitle}>DISCIPLINAS: {disciplinas.length || 0}</h1>
          </div>
        </HStack>


        <div className="border-t border-black my-10 border-2	"/>
        <div className="grid w-full grid-cols-3 gap-10">
          <DashboardGrupos data={grupos}/>
          <DashboardAlunos data={alunos2} />
          <DashboardAlunosGeral data={alunos3}  />
        </div>
      </div>
    </div>
  );
}

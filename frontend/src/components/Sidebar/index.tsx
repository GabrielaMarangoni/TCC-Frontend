import "remixicon/fonts/remixicon.css";

import React, { useEffect } from "react";
import { divGeneral } from "./styles";
import { NavSection } from "./NavSection";
import { NavButton } from "./NavButton";
import { Stack } from "@chakra-ui/react";
import { InfoNavSection } from "./InfoNavSection";
import { useRouter } from "next/router";
import { useUser } from "../../../context/loggedUser";


export default function Sidebar({}) {
  const router = useRouter();
  const [isAdm, setIsAdm] = React.useState(false);

   const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('professor_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('adm');
    router.push('/');
  }

  const initialState = {
    professor_name: typeof window !== "undefined" ? window.localStorage.getItem('professor_name') : '',
    email: typeof window !== "undefined" ?  window.localStorage.getItem('user_email') : '',
    isCoord: typeof window !== "undefined" ?  window.localStorage.getItem('adm') : '',
  }; 

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem('adm') && window.localStorage.getItem('adm') === 'true') {
        setIsAdm(true);
      }
    }
  }, [])

  return (
    <Stack>
      <div className={divGeneral}>
        <div className="h-20 bg-no-repeat bg-logo bg-contain m-7" />     

        <NavSection title="Geral">
          <NavButton icon="ri-dashboard-line" title="Dashboard" href="/geral/dashboard" />
          <NavButton icon="ri-user-fill" title="Alunos" href="/geral/alunos" />
          <NavButton icon="ri-folder-3-fill" title="Documentos" href="/geral/documentos"/>
          <NavButton icon="ri-calendar-event-fill" title="Calendário Acadêmico" href="/geral/calendario" />
          {/* <NavButton icon="ri-timer-fill" title="Horário dos professores" href="/geral/horario" /> */}
          {/* <NavButton icon="ri-pencil-ruler-line" title="Grupos" href="/geral/grupos" /> */}
          <NavButton icon="ri-booklet-fill" title="Minhas Observações" href="/geral/observacao/minhasObs" />
        </NavSection>

        <NavSection title="Gerenciamento">
          {isAdm && <NavButton icon="ri-spam-2-fill" title="Alunos Inativos" href="/gerenciamento/alunosInativos" />}
          {isAdm && <NavButton icon="ri-user-fill" title="Alunos" href="/gerenciamento/alunos" />}
          {isAdm && <NavButton icon="ri-team-fill" title="Professores" href="/gerenciamento/professores" />}
          {isAdm && <NavButton icon="ri-pencil-ruler-line" title="Disciplinas" href="/gerenciamento/disciplinas" />}
          {isAdm && <NavButton icon="ri-folder-3-fill" title="Documentos" href="/gerenciamento/documentos" />}
          {isAdm && <NavButton icon="ri-calendar-event-fill" title="Calendário Acadêmico" href="/gerenciamento/calendario"/> }
          <NavButton icon="ri-group-fill" title="Grupos" href="/gerenciamento/grupos" />
          {/* <NavButton icon="ri-user-fill" title="Atendimentos" href="/gerenciamento/atendimentos" /> */}
          <NavButton icon="ri-user-fill" title="Meu perfil" href="/gerenciamento/perfil" />
        </NavSection>
      
      <InfoNavSection name={initialState.professor_name as string} email={initialState.email as string} logout={logout} />
      </div>
    </Stack>
  );
}



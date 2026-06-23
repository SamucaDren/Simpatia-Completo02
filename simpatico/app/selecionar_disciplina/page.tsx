import { DisciplineForm } from "@/components/DisciplineForm/DisciplineForm";
import { Header } from "@/components/Header/Header";
import { Avatar, Link as MuiLink } from "@mui/material";
import Link from "next/link";
export default function SelecionarDisciplina() {
  return (
    <>
      <Header>
        <MuiLink
          component={Link}
          href="/"
          color="primary.main"
          underline="none"
          data-tour-id="header-voltar"
        >
          Voltar
        </MuiLink>
        <MuiLink href="#">
          <Avatar sx={{ bgcolor: "primary.main" }} data-tour-id="header-avatar" />
        </MuiLink>
      </Header>
      <DisciplineForm />
    </>
  );
}

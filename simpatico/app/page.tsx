import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header>
        <Button
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 999, width: 100 }}
          component={Link}
          href="/selecionar_disciplina"
          data-tour-id="header-entrar"
        >
          Entrar
        </Button>
      </Header>
      <Hero />
    </>
  );
}

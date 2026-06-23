import { ChatInput } from "@/components/ChatInput/ChatInput";
import { Chat } from "@/components/Chats/Chat";
import { Header } from "@/components/Header/Header";
import { Avatar, Button, Link as MuiLink } from "@mui/material";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <Header>
        <Button
          component={Link}
          href="/selecionar_disciplina"
          variant="outlined"
          sx={{ borderRadius: 999 }}
          data-tour-id="header-alterar"
        >
          Alterar Disciplina
        </Button>
        <MuiLink href="#">
          <Avatar sx={{ bgcolor: "primary.main" }} data-tour-id="header-avatar" />
        </MuiLink>
      </Header>
      <Chat />
      <ChatInput />
    </>
  );
}

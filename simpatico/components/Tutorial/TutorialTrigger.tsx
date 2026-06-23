"use client";

import { Box, Button } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TUTORIAL_RESTART_EVENT, TUTORIAL_STORAGE_KEY } from "@/lib/tutorialConstants";

export function TutorialTrigger() {
  const handleRestart = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(TUTORIAL_RESTART_EVENT));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 20, md: 24 },
        left: { xs: 16, sm: 20, md: 24 },
        zIndex: 1350,
      }}
    >
      <Button
        variant="outlined"
        size="small"
        startIcon={<HelpOutlineIcon />}
        onClick={handleRestart}
        sx={{
          borderRadius: 999,
          backgroundColor: "white",
          borderColor: "rgba(37, 99, 235, 0.4)",
          color: "primary.main",
          boxShadow: "0 12px 30px rgba(37, 99, 235, 0.18)",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#EFF6FF",
            borderColor: "primary.main",
          },
        }}
      >
        Iniciar tutorial
      </Button>
    </Box>
  );
}

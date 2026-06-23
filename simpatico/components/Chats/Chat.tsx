"use client";
import { useCourse } from "@/lib/context/useCourse";
import { Grid, Typography } from "@mui/material";

export const Chat = () => {
  const { selectedCourse, selectedDiscipline } = useCourse();

  return (
    <>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid
          size={{ xs: 11, sm: 11, md: 10 }}
          sx={{
            backgroundColor: "background.default",
            textAlign: "center",
            my: 5,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: "#0C0C12",
              fontWeight: 600,
            }}
          >
            {selectedCourse}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: "#4C4B67",
              fontWeight: 500,
            }}
          >
            {selectedDiscipline}
          </Typography>
        </Grid>
      </Grid>
      <Grid container></Grid>
    </>
  );
};

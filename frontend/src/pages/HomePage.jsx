import { Box } from "@mui/material";
import GameGrid from "../components/GameGrid";

function HomePage() {
  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <GameGrid />
    </Box>
  );
}

export default HomePage;

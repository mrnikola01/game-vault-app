import useFetch from "../hooks/useFetch";
import { Grid, Container, CircularProgress, Box } from "@mui/material";
import { getGames } from "../api/games";
import GameCard from "./GameCard";

function GameGrid() {
  const { data: games, isLoading, error } = useFetch(() => getGames());

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  
  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Grid container spacing={3}>
        {games?.map((game) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={game.id}>
            <GameCard
              id={game.id}
              title={game.title}
              price={game.price}
              image={game.image_url}
              slug={game.slug}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default GameGrid;

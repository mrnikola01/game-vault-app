import { useState } from "react";
import useFetch from "../hooks/useFetch";
import { 
  Grid, 
  Container, 
  Box, 
  Typography, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Stack
} from "@mui/material";
import { 
  Sort as SortIcon 
} from "@mui/icons-material";
import { getGames } from "../api/games";
import GameCard from "./GameCard";
import LoadingSpinner from "./LoadingSpinner";

function GameGrid() {
  const [ordering, setOrdering] = useState("title"); // Default sort by title

  const { 
    data: games, 
    isLoading, 
    error 
  } = useFetch(() => getGames("", ordering), [ordering]);

  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        spacing={3} 
        justifyContent="space-between" 
        alignItems={{ xs: "stretch", md: "flex-end" }}
        sx={{ mb: 6 }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
            Explore Games
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover your next favorite adventure
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={ordering}
            label="Sort By"
            onChange={(e) => setOrdering(e.target.value)}
            startAdornment={<SortIcon sx={{ mr: 1, color: "primary.main" }} />}
          >
            <MenuItem value="title">Alphabetical (A-Z)</MenuItem>
            <MenuItem value="-title">Alphabetical (Z-A)</MenuItem>
            <MenuItem value="price">Price: Low to High</MenuItem>
            <MenuItem value="-price">Price: High to Low</MenuItem>
            <MenuItem value="-created_at">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container spacing={4}>
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
          {games?.length === 0 && (
            <Box sx={{ width: "100%", py: 10, textAlign: "center" }}>
              <Typography variant="h5" color="text.secondary">
                No games found.
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default GameGrid;

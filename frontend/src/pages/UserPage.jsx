import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { getFavorites } from "../api/games";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/LoadingSpinner";

function UserPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getFavorites().then((data) => {
        if (data) setFavorites(data);
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    logout();
    navigate("/");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5 }}>
            {user?.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            User Profile
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleSignOut}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Favorite Games
        </Typography>
        {favorites.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No favorite games yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {favorites.map((fav) => (
              <Grid size={{ xs: 12, sm: 6 }} key={fav.id}>
                <GameCard
                  title={fav.game_details.title}
                  price={fav.game_details.price}
                  image={fav.game_details.image_url}
                  slug={fav.game_details.slug}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default UserPage;

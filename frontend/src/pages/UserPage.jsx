import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
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

  const openAdmin = () => {
    window.open("http://localhost:8000/admin/", "_blank");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #333",
          background: "linear-gradient(145deg, #1a1a1a 0%, #121212 100%)",
          mb: 6,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                fontSize: "3rem",
                fontWeight: 900,
              }}
            >
              {user?.email?.[0].toUpperCase()}
            </Avatar>
          </Grid>
          <Grid size={{ xs: 12, sm: "grow" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
              Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {user?.email}
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AdminIcon />}
                onClick={openAdmin}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Admin Panel
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleSignOut}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Sign Out
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <FavoriteIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            My Favorites
          </Typography>
        </Stack>
        
        {favorites.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              borderStyle: "dashed",
            }}
          >
            <Typography color="text.secondary">
              You haven't added any games to your favorites yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
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

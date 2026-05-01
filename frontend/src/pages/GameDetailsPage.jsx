import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  getGameBySlug,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../api/games";
import LoadingSpinner from "../components/LoadingSpinner";

function GameDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoriteId, setFavoriteId] = useState(null);
  const { addToCart } = useCart();

  const {
    data: game,
    isLoading,
    error,
  } = useFetch(() => getGameBySlug(slug), [slug]);

  useEffect(() => {
    if (user && game) {
      getFavorites().then((favorites) => {
        const fav = favorites.find(f => f.game === game.id);
        setFavoriteId(fav ? fav.id : null);
      });
    }
  }, [user, game]);

  const handleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (favoriteId) {
      await removeFavorite(favoriteId);
      setFavoriteId(null);
    } else {
      const newFav = await addFavorite(game.id);
      setFavoriteId(newFav.id);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    await addToCart(game.id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;
  if (!game) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            component="img"
            src={game.image_url}
            alt={game.title}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 4,
              display: "block",
              mb: 4,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            About the game
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.8, mb: 4 }}
          >
            {game.description}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: "sticky", top: 100 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, mb: 1, lineHeight: 1.2 }}
            >
              {game.title}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography
              variant="h2"
              color="primary"
              sx={{ fontWeight: 900, mb: 4 }}
            >
              €{game.price}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleBuyNow}
              sx={{ py: 2, fontSize: "1.2rem", fontWeight: 800 }}
            >
              Buy Now
            </Button>

            <Button
              variant={favoriteId ? "contained" : "outlined"}
              fullWidth
              size="large"
              startIcon={<FavoriteIcon />}
              onClick={handleFavorite}
              sx={{ py: 2, fontSize: "1.2rem", fontWeight: 800, mt: 2 }}
            >
              {favoriteId ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default GameDetailsPage;

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
  TextField,
  Paper,
  Stack,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ChatBubbleOutline as ReviewIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  getGameBySlug,
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../api/games";
import { addReview, deleteReview } from "../api/reviews";
import LoadingSpinner from "../components/LoadingSpinner";

function GameDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoriteId, setFavoriteId] = useState(null);
  const { addToCart } = useCart();

  // Review states
  const [isLike, setIsLike] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const {
    data: game,
    isLoading,
    error,
    refresh,
  } = useFetch(() => getGameBySlug(slug), [slug]);

  useEffect(() => {
    if (user && game) {
      getFavorites().then((favorites) => {
        const fav = favorites.find((f) => f.game === game.id);
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

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addReview(game.id, isLike, comment);
      setComment("");
      setSnackbar({ open: true, message: "Review posted successfully!", severity: "success" });
      refresh();
    } catch (err) {
      setSnackbar({ open: true, message: err.detail || "Error posting review.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewDelete = async () => {
    try {
      await deleteReview(reviewToDelete);
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: "Review deleted successfully!", severity: "success" });
      refresh();
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete review.", severity: "error" });
    }
  };

  const confirmDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;
  if (!game) return null;

  const userAlreadyReviewed = game.reviews?.some((r) => r.user === user?.id);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={6}>
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
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          />
          
          <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "primary.main" }}>
                {game.likes_count}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Likes
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "error.main" }}>
                {game.dislikes_count}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Dislikes
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            About the game
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", lineHeight: 1.8, mb: 6 }}
          >
            {game.description}
          </Typography>

          <Divider sx={{ mb: 6 }} />

          {/* REVIEWS SECTION */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
              <ReviewIcon color="primary" />
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Reviews ({game.reviews?.length || 0})
              </Typography>
            </Stack>

            {/* REVIEW FORM */}
            {user && !userAlreadyReviewed ? (
              <Paper sx={{ p: 3, mb: 6, borderRadius: 3, border: "1px solid #333" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Leave a Review
                </Typography>
                <form onSubmit={handleReviewSubmit}>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button
                      variant={isLike ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setIsLike(true)}
                      startIcon={<ThumbUpIcon />}
                    >
                      Like
                    </Button>
                    <Button
                      variant={!isLike ? "contained" : "outlined"}
                      color="error"
                      onClick={() => setIsLike(false)}
                      startIcon={<ThumbDownIcon />}
                    >
                      Dislike
                    </Button>
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Tell us what you think..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ fontWeight: 700 }}
                  >
                    Post Review
                  </Button>
                </form>
              </Paper>
            ) : user && userAlreadyReviewed ? (
              <Typography sx={{ mb: 6, color: "text.secondary", fontStyle: "italic" }}>
                You have already shared your thoughts on this game.
              </Typography>
            ) : (
              <Button 
                variant="outlined" 
                onClick={() => navigate("/login")}
                sx={{ mb: 6 }}
              >
                Sign in to leave a review
              </Button>
            )}

            {/* REVIEWS LIST */}
            <Stack spacing={3}>
              {game.reviews?.map((review) => (
                <Paper
                  key={review.id}
                  sx={{ p: 3, borderRadius: 3, background: "#1a1a1a" }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: review.is_like ? "primary.main" : "error.main" }}>
                      {review.is_like ? <ThumbUpIcon /> : <ThumbDownIcon />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {review.user_display_name || review.user_email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    {user?.id === review.user && (
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => confirmDelete(review.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  <Typography variant="body1">
                    {review.comment}
                  </Typography>
                </Paper>
              ))}
              {game.reviews?.length === 0 && (
                <Typography color="text.secondary">
                  No reviews yet. Be the first to share your experience!
                </Typography>
              )}
            </Stack>
          </Box>
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

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Review?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently remove your review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleReviewDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* NOTIFICATION SNACKBAR */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%', fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default GameDetailsPage;

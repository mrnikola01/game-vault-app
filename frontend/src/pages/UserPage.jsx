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
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Favorite as FavoriteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { getFavorites } from "../api/games";
import GameCard from "../components/GameCard";
import LoadingSpinner from "../components/LoadingSpinner";

function UserPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: "", avatar: "", username: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setEditData({ 
        bio: user.bio || "", 
        avatar: user.avatar || "",
        username: user.username || "" 
      });
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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    } finally {
      setIsSaving(false);
    }
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
        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                fontSize: "3rem",
                fontWeight: 900,
              }}
            >
              {!user?.avatar && user?.email?.[0].toUpperCase()}
            </Avatar>
          </Grid>
          <Grid size={{ xs: 12, sm: "grow" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {user?.username || "Gamer"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              {!isEditing && (
                <Button 
                  startIcon={<EditIcon />} 
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                  size="small"
                >
                  Edit
                </Button>
              )}
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

            {isEditing ? (
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  label="Username"
                  fullWidth
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  placeholder="Your unique handle"
                />
                <TextField
                  label="Bio"
                  multiline
                  rows={3}
                  fullWidth
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
                <TextField
                  label="Avatar URL"
                  fullWidth
                  value={editData.avatar}
                  onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                  placeholder="Link to your profile picture"
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<CancelIcon />}
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  About Me
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, fontStyle: user?.bio ? "normal" : "italic" }}>
                  {user?.bio || "No biography added yet. Click edit to tell your story!"}
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
              </Box>
            )}
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

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default UserPage;

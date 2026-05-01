import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
  TextField,
  CircularProgress,
  Autocomplete,
  Badge,
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import useDebouncedSearch from "../hooks/useDebouncedSearch";

function Navbar() {
  const navigate = useNavigate();
  const { options, loading, handleSearch } = useDebouncedSearch();
  const { cartCount } = useCart();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#121212",
        borderBottom: "1px solid #333",
        py: { xs: 1, sm: 0 },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            px: 3,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              onClick={() => navigate("/")}
              sx={{
                fontWeight: 900,
                color: "primary.main",
                letterSpacing: "-1px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              GameVault
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <PersonIcon onClick={() => navigate(`/login`)} />
            </IconButton>
          </Box>

          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.title || ""}
            loading={loading}
            onInputChange={(event, value) => handleSearch(value)}
            onChange={(event, value) => {
              if (value?.slug) {
                navigate(`/games/${value.slug}`);
              }
            }}
            sx={{
              width: "100%",
              mt: { xs: 1, sm: 0 },
              maxWidth: { sm: 250, md: 400 },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for games..."
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {loading && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

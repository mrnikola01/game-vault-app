import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

function CartPage() {
  const navigate = useNavigate();
  const { cart, subtotal, isLoading, removeFromCart, updateQuantity } =
    useCart();

  const handleRemove = async (cartItemId) => {
    removeFromCart(cartItemId);
  };

  const handleQuantity = (cartItemId, quantity, delta) => {
    const newQty = Math.max(1, quantity + delta);

    if (newQty !== quantity) {
      updateQuantity(cartItemId, newQty);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, color: "primary.main", textAlign: "center" }}
        >
          CART
        </Typography>
      </Box>

      {cart.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <ShoppingCartIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.2 }}
          />
          <Typography variant="h5" sx={{ mb: 3, color: "text.secondary" }}>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            startIcon={<ArrowBackIcon />}
          >
            Go Back to Shop
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={0}>
              {cart.map((item) => (
                <Box key={item.id}>
                  <Box sx={{ py: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: "auto" }}>
                        <Box
                          component="img"
                          src={item.game_details?.image_url}
                          alt={item.game_details?.title}
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            objectFit: "cover",
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          {item.game_details?.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantity(item.id, item.quantity, -1)
                            }
                            sx={{ border: "1px solid #333" }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{
                              minWidth: 30,
                              textAlign: "center",
                              fontWeight: 700,
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantity(item.id, item.quantity, 1)
                            }
                            sx={{ border: "1px solid #333" }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: "auto" }}
                        sx={{ textAlign: { xs: "left", sm: "right" } }}
                      >
                        <Typography
                          variant="h5"
                          color="primary"
                          sx={{ fontWeight: 900, mb: 1 }}
                        >
                          €{(item.game_details?.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemove(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  <Divider />
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
                Order Summary
              </Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    €{subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Total
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 900 }}
                  >
                    €{subtotal.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PaymentIcon />}
                onClick={() => navigate("/checkout")}
                sx={{ py: 2, fontWeight: 800 }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default CartPage;

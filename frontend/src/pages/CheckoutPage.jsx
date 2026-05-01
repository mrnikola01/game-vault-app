import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  TextField,
  Button,
  Divider,
  MenuItem,
} from "@mui/material";
import { Payment as PaymentIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

const paymentMethods = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "MasterCard" },
  { value: "applepay", label: "Apple Pay" },
  { value: "paypal", label: "PayPal" },
];

function CheckoutPage() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { cart, subtotal, isLoading } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "visa",
  });

  const handleChange = (e) => {
    if (error) setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    setError("");

    const { firstName, lastName, address, city, country } = formData;

    if (!firstName || !lastName || !address || !city || !country) {
      setError("All fields are requested");
      return;
    }

    const geoRegex = /^[a-zA-Z\sčćžšđČĆŽŠĐ\-]+$/;
    if (!geoRegex.test(city) || !geoRegex.test(country)) {
      setError("City and Country must contain only letters");
      return;
    }

    const nameRegex = /^[a-zA-Z\sčćžšđČĆŽŠĐ]{2,}$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError("Names must contain only letters (min 2)");
      return;
    }

    console.log("Order placed:", { formData, items: cart, total: subtotal });
    navigate("/");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{ fontWeight: 900, color: "primary.main", textAlign: "center" }}
        >
          CHECKOUT
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ maxWidth: 600 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
              Shipping & Payment Information
            </Typography>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  variant="outlined"
                />
              </Stack>

              <TextField
                fullWidth
                label="Shipping Address"
                name="address"
                onChange={handleChange}
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                />
              </Stack>

              <TextField
                fullWidth
                select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                {paymentMethods.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ fontWeight: 700 }}
                >
                  {error}
                </Typography>
              )}

              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  All transactions are secure and encrypted.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ position: "sticky", top: 100 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              Order Summary
            </Typography>

            <Stack spacing={0} sx={{ mb: 3 }}>
              {cart.map((item) => (
                <Box key={item.id}>
                  <Box
                    sx={{
                      py: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.game_details?.image_url}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {item.game_details?.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      €{(item.game_details?.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              ))}
            </Stack>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  €{subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography sx={{ fontWeight: 600 }}>Free</Typography>
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
              onClick={handlePlaceOrder}
              sx={{ py: 2, fontWeight: 800, borderRadius: 2 }}
            >
              Complete Purchase
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CheckoutPage;

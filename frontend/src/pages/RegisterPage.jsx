import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are requested");
      return;
    }

    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError(err.email?.[0] || err.detail || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: "primary.main", mb: 1 }}
          >
            GAMEVAULT
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join our community
          </Typography>
        </Box>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            size="large"
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/login")}
                color="primary"
                sx={{
                  fontWeight: 700,
                  textDecoration: "none",
                  verticalAlign: "baseline",
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default RegisterPage;

import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function GameCard({ title, price, image, slug }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, px: 2 }}>
        <Typography
          variant="h6"
          onClick={() => navigate(`/games/${slug}`)}
          sx={{
            mt: 0.5,
            mb: 1,
            fontSize: "1rem",
            lineHeight: 1.2,
            height: "2.4em",
            overflow: "hidden",
            cursor: "pointer",
            "&:hover": { color: "primary.main" },
          }}
        >
          {title}
        </Typography>

        <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
          €{price}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default GameCard;

// import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Recipes() {
  const { recipes } = useLoaderData();
  return (
    <section>
      <Box sx={{ width: 1000, minHeight: 1000, padding: "0 auto" }}>
        <Masonry columns={4} spacing={2}>
          {recipes.map((recipe) => (
            <Link key={recipe.id} to={`recipes/${recipe.id}`}>
              <Card
                key={recipe.id}
                sx={{
                  minWidth: 200,
                  minHeight: 200,
                  maxHeight: 200,
                  maxWidth: 200,
                }}
              >
                <CardActionArea>
                  {recipe.image ? (
                    <CardMedia
                      component="img"
                      height={200}
                      image={recipe.image}
                      alt={recipe.name}
                    />
                  ) : (
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height={200}
                      >
                        <Typography
                          variant="h2"
                          component="div"
                          style={{ textDecoration: "none" }}
                        >
                          {recipe.name}
                        </Typography>
                      </Box>
                    </CardContent>
                  )}
                  {/* <CardContent height={200}>
                    <Typography gutterBottom variant="h4" component="div">
                      {recipe.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.description}
                    </Typography>
                  </CardContent> */}
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Masonry>
      </Box>
    </section>
  );
}

import { useLoaderData } from "react-router-dom";
import { getRecipe } from "../recipes.js";

export async function loader({ params }) {
  return getRecipe(params.recipeId);
}

const RecipeDetail = () => {
  const recipe = useLoaderData();

  return (
    <div>
      <h1>{recipe.name}</h1>
      <img src={recipe.image} alt="recipe" />
    </div>
  );
};
export default RecipeDetail;

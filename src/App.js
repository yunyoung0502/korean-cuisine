import "./App.css";
import Header from "./components/Header.js";
import IngredientNetwork from "./components/IngredientNetwork.js";
import Recipes from "./components/Recipes.js";
import { Outlet } from "react-router-dom";
import { getRecipes } from "./recipes.js";

export async function loader() {
  const recipes = await getRecipes();
  return { recipes };
}

function App() {
  return (
    <div className="App">
      <Header />
      <IngredientNetwork />
      <Recipes />
      <Outlet />
    </div>
  );
}

export default App;

import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";

import RecipeDetail, {
  loader as recipeLoader,
} from "./components/RecipeDetail";
import App, { loader as appLoader } from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: appLoader,
  },
  {
    path: "recipes/:recipeId",
    loader: recipeLoader,
    errorElement: <ErrorPage />,
    element: <RecipeDetail />,
  },
]);

export default router;

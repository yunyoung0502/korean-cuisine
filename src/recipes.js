import sjcl from "sjcl";
const context = require.context("./data", true, /.json$/);
const recipes = [];
context.keys().forEach((key) => {
  const fileName = key.replace("./", "");
  const resource = require(`./data/${fileName}`);
  const recipe = JSON.parse(JSON.stringify(resource));
  recipe.id = sjcl.codec.hex.fromBits(
    sjcl.hash.sha256.hash(recipe.name + recipe.book)
  );

  recipes.push(recipe);
});

export async function getRecipes() {
  return recipes;
}

export async function getRecipe(id) {
  return recipes.find((recipe) => String(recipe.id) === String(id)) ?? null;
}
const colorPalette = [
  "#1f78b4",
  "#33a02c",
  "#e31a1c",
  "#ff7f00",
  "#6a3d9a",
  "#b15928",
];
export async function getFoodNetworkData() {
  let nodes = [];
  let edges = [];
  let edgeIdCounter = 0;

  let nodeDegree = {}; // To keep track of each node's degree

  let bookColorMap = {};
  let colorIndex = 0;

  // Initialize nodes and node degrees
  recipes.forEach((food) => {
    const id = food.id;
    nodes.push({
      key: id,
      color: food.book,
      attributes: {
        label: food.name,
        size: 0, // Initialize with a size of 0
        x: Math.random(),
        y: Math.random(),
      },
    });
    nodeDegree[id] = 10; // Initialize degree to 0
    if (!bookColorMap[food.book]) {
      bookColorMap[food.book] = colorPalette[colorIndex % colorPalette.length];
      colorIndex++;
    }
    nodes[nodes.length - 1].attributes.color = bookColorMap[food.book];
  });

  let edgeMap = {}; // To keep track of common ingredients for each pair of nodes

  // Populate ingredientMap and edgeMap in a single loop
  recipes.forEach((food) => {
    food.ingredients.forEach((ingredient) => {
      if (!edgeMap[ingredient]) {
        edgeMap[ingredient] = [];
      }

      // Update edge sizes and node degrees
      edgeMap[ingredient].forEach((existingNodeId) => {
        const edgeKey = `${existingNodeId}-${food.id}`;
        if (!edgeMap[edgeKey]) {
          edgeMap[edgeKey] = 1; // Initialize edge size
          edges.push({
            key: `e${edgeIdCounter++}`,
            source: existingNodeId,
            target: food.id,
            size: 10,
          });

          // Increment node degrees
          nodeDegree[existingNodeId]++;
          nodeDegree[food.id]++;
        } else {
          edgeMap[edgeKey]++; // Increment edge size for common ingredient
        }
      });

      edgeMap[ingredient].push(food.id);
    });
  });

  // Update node sizes based on their degrees
  nodes.forEach((node) => {
    node.attributes.size = nodeDegree[node.key];
  });

  return {
    nodes,
    edges,
  };
}

export async function getIngredientsNetworkData() {
  let nodes = [];
  let edges = [];
  let edgeIdCounter = 0;

  let nodeDegree = {}; // To keep track of each node's degree
  let ingredientSet = new Set(); // To hold unique ingredients

  // Populate the set of unique ingredients
  recipes.forEach((food) => {
    food.ingredients.forEach((ingredient) => {
      ingredientSet.add(ingredient);
    });
  });

  // Initialize nodes based on unique ingredients
  ingredientSet.forEach((ingredient) => {
    nodes.push({
      key: ingredient,
      attributes: {
        label: ingredient,
        size: 0,
        x: Math.random(),
        y: Math.random(),
      },
    });
    nodeDegree[ingredient] = 10; // Initialize degree to 0
  });

  let edgeMap = {}; // To keep track of common foods for each pair of ingredients

  // Populate edgeMap based on common foods
  recipes.forEach((food) => {
    const { ingredients } = food;
    for (let i = 0; i < ingredients.length; i++) {
      for (let j = i + 1; j < ingredients.length; j++) {
        const edgeKey = `${ingredients[i]}-${ingredients[j]}`;
        if (!edgeMap[edgeKey]) {
          edgeMap[edgeKey] = 1; // Initialize edge size
          edges.push({
            key: `e${edgeIdCounter++}`,
            source: ingredients[i],
            target: ingredients[j],
            size: 1,
          });

          // Increment node degrees
          nodeDegree[ingredients[i]]++;
          nodeDegree[ingredients[j]]++;
        } else {
          edgeMap[edgeKey]++; // Increment edge size for common food
        }
      }
    }
  });

  // Update node sizes based on their degrees
  nodes.forEach((node) => {
    node.attributes.size = nodeDegree[node.key];
  });

  return {
    nodes,
    edges,
  };
}

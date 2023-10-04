import React, { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Arctic from "./arctic.gexf";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";
import ForceSupervisor from "graphology-layout-force/worker";
import { getFoodNetworkData, getIngredientsNetworkData } from "../recipes";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

let FoodNetworkData;
let IngredientNetworkData;
getFoodNetworkData().then((data) => {
  FoodNetworkData = data;
});
getIngredientsNetworkData().then((data) => {
  IngredientNetworkData = data;
});

const IngredientNetwork = () => {
  const containerRef = useRef(null);
  const controlRef = useRef(null);
  const zoomIn = useRef(null);
  const zoomOut = useRef(null);
  const zoomReset = useRef(null);
  const [graph, setGraph] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);
  const isDraggingRef = useRef(false);
  const draggedNodeRef = useRef(null);
  const [activeNetwork, setActiveNetwork] = useState("Ingredients");
  useEffect(() => {
    const loadGraph = () => {
      if (graph) {
        graph.clear();
      }
      const networkData =
        activeNetwork === "Ingredients"
          ? IngredientNetworkData
          : FoodNetworkData;
      const g = Graph.from(networkData, { multi: true });
      setGraph(g);
    };

    loadGraph();
  }, [activeNetwork]);

  useEffect(() => {
    if (graph && containerRef.current) {
      const newRenderer = new Sigma(graph, containerRef.current, {
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
        allowInvalidContainer: true,
      });

      setRenderer(newRenderer);
      const sensibleSettings = forceAtlas2.inferSettings(graph);
      const fa2Layout = new FA2Layout(graph, {
        iterations: 10,
        settings: {
          ...sensibleSettings,
          gravity: 1,
          barnesHutOptimize: true,
          barnesHutTheta: 1,
          slowDown: 4,
        },
      });
      const layout = new ForceSupervisor(graph, {
        maxIterations: 10,
        attraction: 1,
        repulsion: 10,
        gravity: 0.1,
        inertia: 0,
        isNodeFixed: (_, attr) => attr.highlighted,
        maxMove: 10,
      });
      layout.start();

      const attachDragLogic = (rendererInstance) => {
        if (rendererInstance && typeof rendererInstance.on === "function") {
          rendererInstance.on("downNode", (e) => {
            isDraggingRef.current = true;
            draggedNodeRef.current = e.node;
            graph.setNodeAttribute(draggedNodeRef.current, "highlighted", true);
          });

          rendererInstance.getMouseCaptor().on("mousemovebody", (e) => {
            if (!isDraggingRef.current || !draggedNodeRef.current) return;
            const pos = rendererInstance.viewportToGraph(e);
            graph.setNodeAttribute(draggedNodeRef.current, "x", pos.x);
            graph.setNodeAttribute(draggedNodeRef.current, "y", pos.y);
            e.preventSigmaDefault();
            e.original.preventDefault();
            e.original.stopPropagation();
          });

          rendererInstance.getMouseCaptor().on("mouseup", () => {
            if (draggedNodeRef.current) {
              graph.removeNodeAttribute(draggedNodeRef.current, "highlighted");
            }
            isDraggingRef.current = false;
            draggedNodeRef.current = null;
          });
        } else {
          console.error("Could not attach event listener to renderer");
        }
      };

      attachDragLogic(newRenderer);
      return () => {
        // Stop the layout algorithm if running
        fa2Layout.kill();
      };
    }
  }, [graph]);

  useEffect(() => {
    if (camera) {
      const zoomInAction = () => {
        console.log("Zooming in");
        camera.animatedZoom({ duration: 600 });
      };

      const zoomOutAction = () => {
        console.log("Zooming out");
        camera.animatedUnzoom({ duration: 600 });
      };

      const zoomResetAction = () => {
        console.log("Resetting zoom");
        camera.animatedReset({ duration: 600 });
      };

      const zoomInBtn = zoomIn.current;
      const zoomOutBtn = zoomOut.current;
      const zoomResetBtn = zoomReset.current;

      if (zoomInBtn && zoomOutBtn && zoomResetBtn) {
        console.log("Adding event listeners");
        zoomInBtn.addEventListener("click", zoomInAction);
        zoomOutBtn.addEventListener("click", zoomOutAction);
        zoomResetBtn.addEventListener("click", zoomResetAction);
      }

      // Cleanup
      return () => {
        console.log("Removing event listeners");
        if (zoomInBtn) zoomInBtn.removeEventListener("click", zoomInAction);
        if (zoomOutBtn) zoomOutBtn.removeEventListener("click", zoomOutAction);
        if (zoomResetBtn)
          zoomResetBtn.removeEventListener("click", zoomResetAction);
      };
    }
  }, [camera, renderer]);

  return (
    <section>
      <div>
        <Button variant="text" onClick={() => setActiveNetwork("Food")}>
          <Typography variant="h5">Food</Typography>
        </Button>

        <Button variant="text" onClick={() => setActiveNetwork("Ingredients")}>
          <Typography variant="h5">Ingredients</Typography>
        </Button>
      </div>
      <div id="controls" ref={controlRef} style={{ marginBottom: 100 }}>
        <div className="input" ref={zoomIn}>
          <label htmlFor="zoom-in">Zoom in</label>
          <button>+</button>
        </div>
        <div className="input" ref={zoomOut}>
          <label htmlFor="zoom-out">Zoom out</label>
          <button>-</button>
        </div>
        <div className="input" ref={zoomReset}>
          <label htmlFor="zoom-reset">Reset zoom</label>
          <button>⊙</button>
        </div>
      </div>
      <div
        id="sigma-container"
        ref={containerRef}
        style={{ height: 1000, width: 1000 }}
      ></div>
    </section>
  );
};

export default IngredientNetwork;

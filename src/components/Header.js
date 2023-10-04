import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export default function Header() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <header className="App-header">
      <div className="particles-container">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: { color: { value: "#ffffff" } },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
              },
              modes: {
                push: { quantity: 1 },
                repulse: { distance: 100, duration: 0.4 },
              },
            },
            particles: {
              color: {
                value: "#999999",
              },
              links: {
                color: "#999999",
                distance: 120,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 3,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            fullScreen: { enable: false },
            detectRetina: false,
          }}
        />
        <h1>The Origin of Korean Cuisine</h1>
        {/* <p>Korea University Introduction to Digial Humanities COLA172 </p> */}
      </div>
    </header>
  );
}

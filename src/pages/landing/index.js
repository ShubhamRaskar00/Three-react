import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { animateScroll as scroll } from "react-scroll";
import { Planet, Footer , SpaceBackground } from "../../components/";
import { Link } from "react-router-dom";

function LandingPage() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      setShowScrollIcon(position < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="fixed top-0 right-0 m-4 z-10">
        <Link
          to="/login"
          className="mr-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-blue-500 text-white"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="mr-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-blue-500 text-white"
        >
          Sign Up
        </Link>
      </header>

      <div className="hero-section">
        <h1 className="main-title">Welcome Everyone</h1>
        <button onClick={() => scroll.scrollTo(window.innerHeight)} className="get-started-btn">Begin Journey</button>
      </div>

      {showScrollIcon && (
        <div className="scroll-icon">
          ↓
        </div>
      )}

      <Canvas className="planet-canvas" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <SpaceBackground />
          <Planet position={[0, 0, 0]} scrollPosition={scrollPosition} />
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade={true} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      <div className="content-sections" ref={contentRef}>
        {/* TODO: Add content here */}
        <section>
          <h2>Discover the Red Planet</h2>
          <p>Explore the vast Martian landscape and uncover its ancient secrets.</p>
        </section>
        <section>
          <h2>Martian Mysteries</h2>
          <p>Investigate the potential for past or present life on Mars.</p>
        </section>
        <section>
          <h2>Future Colonization</h2>
          <p>Learn about plans for human settlement and terraforming on Mars.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;

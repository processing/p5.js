// File: P5Canvas.tsx
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

export default function P5Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null); // ✅ type-safe ref for canvas container

  useEffect(() => {
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(200, 200);
      };
      p.draw = () => {
        p.background(0);
        p.ellipse(100, 100, 50, 50);
      };
    };

    const canvas = new p5(sketch, canvasRef.current!); // ✅ attach p5 to div

    return () => {
      canvas.remove(); // ✅ clean up on unmount
    };
  }, []);

  return <div ref={canvasRef} />; // ✅ fixed: use ref instead of id
}

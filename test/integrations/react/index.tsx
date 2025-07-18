import React from 'react';
import { createRoot } from 'react-dom/client';
import p5 from 'p5';

const App = () => {
  React.useEffect(() => {
    new p5(p => {
      p.setup = () => {
        p.createCanvas(100, 100);
      };
    });
  }, []);

  return <div id="sketch" />;
};

createRoot(document.getElementById('sketch')!).render(<App />);

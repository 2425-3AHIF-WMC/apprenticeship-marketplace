import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { useEffect } from "react";
import Index from "./pages/Index";


function App() {
    // Smooth scroll behavior for the entire app
    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href.includes('#') && !link.href.startsWith('#') && link.origin === window.location.origin) {
                const hash = link.href.split('#')[1];
                const element = document.getElementById(hash);

                if (element) {
                    e.preventDefault();
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        document.addEventListener('click', handleLinkClick);
        return () => document.removeEventListener('click', handleLinkClick);
    }, []);

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Index />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App

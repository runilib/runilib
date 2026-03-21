import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { DocsPage } from "./pages/DocsPage";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:lib" element={<DocsPage />} />
        <Route path="/docs/:lib/:page" element={<DocsPage />} />
        <Route path="/libs/:slug" element={<LibraryPage />} />
      </Routes>
      <Footer />
    </>
  );
}

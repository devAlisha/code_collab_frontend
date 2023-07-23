import { BrowserRouter as Browser, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{ success: { theme: { primary: "#4aed88" } } }}
      />
      <Browser>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </Browser>
    </div>
  );
}

export default App;

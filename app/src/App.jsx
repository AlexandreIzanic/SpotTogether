import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./scenes/Home";
import List from "./scenes/List";

function App() {
  return (
    <div className="bg-[#1C1C1C] text-white min-h-screen flex  ">
      <BrowserRouter>
        <Navbar />
        <div className="max-w-7xl m-auto w-full h-full min-h-screen py-4  ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lists/:id" element={<List />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

import logo from "./logo.svg";
import "./index.css";
import Trends from "./Components/Trends";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendPage from "./Components/TrendPage";
import { TrendProvider } from "./Context/TrendProvider";


function App() {

  return (
    <TrendProvider>
      <Router>
        <Routes>

          <Route path="/" element={<Trends />} />
          <Route path="/trend/:id" element={<TrendPage />} />
        </Routes>
      </Router>
    </TrendProvider>
  );
}

export default App;

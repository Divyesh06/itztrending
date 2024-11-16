import logo from "./logo.svg";
import "./index.css";
import Trends from "./Components/Trends";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendPage from "./Components/TrendPage";
import { TrendProvider } from "./Context/TrendProvider";
import Authenticate from "./Components/AuthenticateForm";
import SetProfile from "./Components/SetProfile";
function App() {

  return (
    <TrendProvider>
      <Authenticate mode="signup"/>
      <Router>
        <Routes>

          <Route path="/" element={<Trends />} />
          <Route path="/trend/:id" element={<TrendPage key={window.location.pathname}/>} />
        </Routes>
      </Router>
    </TrendProvider>
  );
}

export default App;

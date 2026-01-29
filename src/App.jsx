import { Routes, Route, Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles"; 
import "./app.css"
import History from "./pages/History";
import LoginPage from "./pages/LoginPage"
import Signup from "./pages/Signup";
import Loader from "./components/Loader"

function App() {
  return (
    <>
    <Loader/>
    <Routes>
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/my-files" element={<MyFiles />} />
      <Route path="/history" element={<History />}/>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/Signup" element={<Signup/>}/>
    </Routes>    
    </>
   
  );
}

export default App;
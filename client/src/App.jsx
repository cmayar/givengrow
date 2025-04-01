import { React } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Components/AuthContext";
import NavigationBar from "./Components/Navigation";

function App() {
  return (
<AuthProvider>
    <NavigationBar/>
</AuthProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import auth from "./services/auth"; 
import ProfilePage from "./pages/ProfilePage";
import RicettaDettaglio from "./pages/RicettaDettaglio";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";


function ProtectedRoute({ children }) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipe/:id" element={<RicettaDettaglio />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        <Route path="/edit-recipe/:id" element={<EditRecipePage />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

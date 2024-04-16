import './App.css';
import { Routes, Route,Link } from "react-router-dom";
import { UserContextProvider } from './context/UserContext'; // Corrección aquí

import SignIn_Login from './pages/SignIn_Login';
import Home from './pages/Home';
import NotFound from "./pages/NotFound";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<SignIn_Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;

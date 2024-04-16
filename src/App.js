import './App.css';
import { Routes, Route} from "react-router-dom";
import { UserContextProvider } from './context/UserContext'; // Corrección aquí

import SignIn_Login from './pages/SignIn_Login';
import Home from './pages/Home';
import NotFound from "./pages/NotFound";
import MyAccount from './pages/MyAccount';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<SignIn_Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/account' element={<MyAccount/>}></Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;

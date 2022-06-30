import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import NavBar from "./pages/NavBar";
import PersistLogin from "./pages/PersistLogin";
import Registration from "./pages/Registration";
import RequireAuth from "./pages/RequireAuth";

function App() {

  return (
    <main>
      <header>
        <NavBar></NavBar>
      </header>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home></Home>} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/home" element={<Home></Home>} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Registration />}></Route>
        </Route>
      </Routes>
    </main>
  );
}

export default App;

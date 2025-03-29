import { Route, Routes} from "react-router-dom";
// import "./assets/css/fontawesome-all.min.css";
import "./assets/css/Navbar.css";
import { Login } from "./Login";
import { Navbar } from "./components/Common/Navbar";

import { Signup } from "./Signup";
import { Content } from "./components/Common/Content";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";

function App() {
  return (
    <div id="wrapper">
      <div id="main">
        <div className="inner">
          <Navbar></Navbar>
          <Routes>
            
              <Route path="/" element={<Content />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />

              <Route path="/signup" element={<Signup />} />
           
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

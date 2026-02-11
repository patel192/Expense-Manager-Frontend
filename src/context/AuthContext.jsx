import { Value } from "@radix-ui/react-select";
import { useState,useContext,createContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if(storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
    }, []);

    const login = (loginReponse) => {
        const {token,data} = loginReponse;

        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(data));

        setToken(token);
        setUser(data);


        if(data.role === "Admin"){
            navigate("/admin/dashboard");
        }else {
            navigate("/private/userdashboard");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{user,token,loading,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
  
}

export const useAuth = () => {
    return useContext(AuthContext);
}
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
 const {user,loading} = useAuth();

 if(loading) return <h1>Loading...</h1>;
 if(!user) return <Navigate to="/login"/>;

 return <Outlet/>
  };
  


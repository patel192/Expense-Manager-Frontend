import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * --- PRIVATE ROUTE GUARD ---
 * Prevents unauthenticated users from accessing protected pages.
 * If no user is found in Redux, it redirects them to the Login page.
 */
export const PrivateRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  // If the user isn't logged in, send them back to the login screen
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them through to the requested page
  return <Outlet />;
};


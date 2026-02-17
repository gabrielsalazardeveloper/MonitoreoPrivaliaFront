import { Navigate } from "react-router-dom";

export const RedirectToLast = () => {
  const lastPath = localStorage.getItem("lastPath") || "/dashboard";

  return <Navigate to={lastPath} replace />;
};

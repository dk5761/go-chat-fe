import { AuthContext } from "@/state/context/auth/authContext";
import { AuthContextType } from "@/state/context/auth/types";
import { useContext } from "react";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default useAuthContext;

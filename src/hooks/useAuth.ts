import { useContext } from "react";
import { AuthContext } from "@/contexts/JWTAuthContext";

export const useAuth = () => useContext(AuthContext);

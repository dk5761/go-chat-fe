import React, {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { AuthAction, AuthContextType, AuthState, UserInfoType } from "./types";
import { jwtDecode } from "jwt-decode";
import useStorage from "@/services/storage/useStorage";
import { storage } from "@/services/storage/mmkv";
import { useRouter, useSegments } from "expo-router";

const initialState: AuthState = {
  token: storage.getString("token") ?? null,
  userInfo: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useProtectedRoute(token: string | undefined | null) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !token &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.

      router.replace("/login");
    } else if (token && inAuthGroup) {
      router.replace("/chat");
    }
  }, [token, segments]);
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "DELETE_AUTH_TOKEN":
      return {
        ...state,
        token: null,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
      };

    case "RESET_AUTH_STATE":
      return initialState;
    default:
      return state;
  }
};

// Utility function to validate JWT token by checking the 'exp' field
const validateToken = (token: string | null | undefined): boolean => {
  // Check if the token is null, undefined, or not a valid string
  if (!token || typeof token !== "string") {
    return false; // Invalid token
  }

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check if the token has expired
    return decodedToken.exp > currentTime;
  } catch (error) {
    return false; // Token is invalid (e.g., if decoding fails)
  }
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const hasCheckedToken = React.useRef(false); // Add a ref to track if the token has been checked

  const {
    getLocalStorage,
    setLocalStorage,
    deleteLocalStorage,
    purgeLocalStorage,
  } = useStorage<string>("token");

  useEffect(() => {
    let portNumber = "";

    // Only check the token once on initial mount
    if (!hasCheckedToken.current) {
      hasCheckedToken.current = true;

      const token = getLocalStorage();
      if (token && validateToken(token)) {
        // Token is valid, set up auto logout based on the token expiration
        setAuthToken(token);
      } else {
        // Token is invalid or expired, clear the state and redirect to login
        logout();
      }
    }
  }, []);

  useProtectedRoute(getLocalStorage());

  // Set token and store it in localStorage
  const setAuthToken = (token: string) => {
    setLocalStorage(token); // Store token in localStorage
    dispatch({ type: "SET_AUTH_TOKEN", payload: token });
  };

  // Delete token from both state and localStorage
  const deleteAuthToken = () => {
    deleteLocalStorage();
    dispatch({ type: "DELETE_AUTH_TOKEN" });
  };

  // Set agent info
  const setUserInfo = (userInfo: UserInfoType | null) => {
    dispatch({ type: "SET_USER_INFO", payload: userInfo });
  };

  // Reset the authentication state and clear localStorage
  const resetAuthState = () => {
    deleteLocalStorage();
    dispatch({ type: "RESET_AUTH_STATE" });
  };

  // Logout user, clear state, and navigate to login page
  const logout = () => {
    deleteAuthToken(); // Clear the token
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      setAuthToken,
      deleteAuthToken,
      setUserInfo,

      resetAuthState,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

// AuthState defines the structure of the authentication state
export interface AuthState {
  token: string | null;

  userInfo: UserInfoType | null;
}

// UserInfoType defines the structure of the agent information (replace with the actual structure)
export type UserInfoType = Record<string, string>;

// AuthAction defines the types of actions that can be dispatched to modify the AuthState
export type AuthAction =
  | { type: "SET_AUTH_TOKEN"; payload: string }
  | { type: "DELETE_AUTH_TOKEN" }
  | { type: "SET_USER_INFO"; payload: UserInfoType | null }
  | { type: "RESET_AUTH_STATE" };

// AuthContextType defines the structure of the context object
export interface AuthContextType {
  state: AuthState;
  setAuthToken: (token: string) => void;
  deleteAuthToken: () => void;
  setUserInfo: (agentInfo: UserInfoType | null) => void;
  resetAuthState: () => void;
}

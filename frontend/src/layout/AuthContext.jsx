import { createContext, useContext } from "solid-js";
import { createSignal } from "solid-js";

const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [isOpenProfile, setIsOpenProfile] = createSignal(false);
  return (
    <AuthContext.Provider 
      value={{ isLoggedIn, setIsLoggedIn
        , isOpenProfile, setIsOpenProfile}}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
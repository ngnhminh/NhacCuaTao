import { createContext, useContext, createSignal, onMount} from "solid-js";

const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [isOpenProfile, setIsOpenProfile] = createSignal(false);
  const [isOpenSearchPage, setIsOpenSearchPage] = createSignal(false);
  const [results, setResults] = createSignal([]);
  const [resultsSong, setResultsSong] = createSignal([]);
  const [currentSong, setCurrentSong] = createSignal(null);

  onMount(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
        setIsLoggedIn(true);
    }
  });

  return (
    <AuthContext.Provider 
      value={{ isLoggedIn, setIsLoggedIn
        , isOpenProfile, setIsOpenProfile
        , isOpenSearchPage, setIsOpenSearchPage
        , results, setResults
        , resultsSong, setResultsSong
        , currentSong, setCurrentSong}}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
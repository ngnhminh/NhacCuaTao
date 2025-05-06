import { createContext, useContext, onMount } from 'solid-js';
import { createSignal } from 'solid-js';

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = createSignal(false);
    const [isOpenProfile, setIsOpenProfile] = createSignal(false);

    onMount(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setIsLoggedIn(true);
        }
    });

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                isOpenProfile,
                setIsOpenProfile,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

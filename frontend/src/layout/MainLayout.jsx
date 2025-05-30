import NavbarLogin from './NavbarLogin';
import NavbarLogout from './NavbarLogout';
import Playbar from './Playbar';
import PlaybarLogout from './PlaybarLogout';
import { useAuth } from './AuthContext';

const MainLayout = (props) => {
    const { isLoggedIn } = useAuth();
    const { currentSong } = useAuth();
    return (
        <div class="block">
            <Show
                when={isLoggedIn()}
                fallback={
                    <>
                        <NavbarLogout />
                        <main>{props.children}</main>
                        <PlaybarLogout />
                    </>
                }
            >
                <>
                    <NavbarLogin />
                    <main>{props.children}</main>
                    {currentSong() && <Playbar />}
                </>
            </Show>
        </div>
    );
};

export default MainLayout;

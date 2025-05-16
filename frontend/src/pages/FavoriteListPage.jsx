import FavoriteListSection from '../components/sections/FavoriteListSection';
import SidePart from '../components/SidePart';
import Footer from '../layout/Footer';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { useAuth } from '../layout/AuthContext';
import Profile from './Profile';
import PanelContainer from '../components/PanelContainer';
import { isSidebarVisible } from '../signal/sidebarStore';
import { useParams } from "@solidjs/router";

const FavoriteListPage = () => {
    let scrollContainer;
    const [scrolled, setScrolled] = createSignal(false);
    const { isOpenProfile } = useAuth();
    const [imgSize, setImgSize] = createSignal('auto');
    const [scalebtn, setScalebtn] = createSignal();
    const [scaletxt, setScaletxt] = createSignal();
    const auth = useAuth();
    
    onMount(() => {
        // Kiểm tra lại scrollContainer có tồn tại không
        if (scrollContainer) {
            const handleScroll = () => {
                setScrolled(scrollContainer.scrollTop > 74);
            };

            scrollContainer.addEventListener('scroll', handleScroll);
            handleScroll(); // Kiểm tra ban đầu

            onCleanup(() => {
                scrollContainer.removeEventListener('scroll', handleScroll);
            });
        }

        const observer = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            if (width >= 1024) {
                setImgSize(48);
                setGridCols('grid-cols-3');
                setScalebtn('scale-80');
                setScaletxt('scale-100');
            } else {
                setImgSize(48);
                setGridCols('grid-cols-2');
                setScalebtn('scale-80');
                setScaletxt('scale-95');
            }
        });

        onCleanup(() => observer.disconnect());
    });

    return (
        <div classList={{
            'h-[calc(100vh-64px-72px)]': auth.currentSong(),
            'h-[calc(100vh-64px)]': !auth.currentSong(),
            'flex gap-3 px-3 pb-3 pt-1 overflow-hidden w-full bg-base-300': true
        }}>
            <SidePart />

            <Show
                when={isOpenProfile()}
                fallback={
                    <div
                        ref={(el) => {
                            scrollContainer = el;
                        }} // Gán đúng ref cho scrollContainer
                        className={`w-full rounded-md overflow-y-auto ease-linear transition-colors duration-400 ${
                            scrolled()
                                ? 'bg-base-200'
                                : 'bg-gradient-to-b from-amber-900/45 to-base-200'
                        }`}
                    >
                        <div className="pb-15">
                            <FavoriteListSection />
                        </div>
                        <Footer />
                    </div>
                }
            >
                <Profile />
            </Show>

            <PanelContainer />
        </div>
    );
};

export default FavoriteListPage;

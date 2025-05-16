import ArtistSection from '../components/sections/ArtistSection';
import Navigation from '../components/sections/Navigation';
import SidePart from '../components/SidePart';
import SidePartLogout from '../components/SidePartLogout';
import Footer from '../layout/Footer';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { useAuth } from '../layout/AuthContext';
import Profile from './Profile';
import PanelContainer from '../components/PanelContainer';
import { isSidebarVisible } from '../signal/sidebarStore';
import { createMemo } from 'solid-js';

const items = [
    {
        name: '9Hz 99Hz 999Hz Infinite Healing Golden WaveㅣVibration of 5 Dimension Frequency',
        img: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da849933214dfb18e7f4bd68e56d',
    },
    {
        name: 'White Noise 10 Hours',
        img: 'https://i.scdn.co/image/ab67706f000000025b4d326fee8531fe32efe166',
    },
    {
        name: 'Nhạc Ru Ngủ Cho Người Mất Ngủ, Dễ ngủ, Giảm Stress',
        img: 'https://mosaic.scdn.co/640/ab67616d00001e0219266a6ed2ebd0fe643ac723ab67616d00001e026f51023755dbf3e9db1215f5ab67616d00001e029b3fb224d88f6914e083ebb7ab67616d00001e02b585ba1ee2b7cfa56185520b',
    },
    {
        name: 'Tiếng Ồn Trắng',
        img: 'https://mosaic.scdn.co/640/ab67616d00001e0206013115ced3cd702e75a844ab67616d00001e0209848e952392cd4a18c5b29fab67616d00001e02ceec45d05413f26e152fb547ab67616d00001e02e34429d776708f87460cd97e',
    },
];

const Artist = () => {
    let scrollContainer;
    const [scrolled, setScrolled] = createSignal(false);
    const { isOpenProfile } = useAuth();
    const { isLoggedIn } = useAuth();
    const [imgSize, setImgSize] = createSignal('auto');
    const [scalebtn, setScalebtn] = createSignal();
    const [scaletxt, setScaletxt] = createSignal();
    const auth = useAuth();

    const gridCols = createMemo(() => {
        return isSidebarVisible() ? 'grid-cols-2' : 'grid-cols-3';
    });

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
                            <ArtistSection />
                        </div>
                        <Footer />
                    </div>
                }
            ></Show>

            <PanelContainer />
        </div>
    );
};

export default Artist;

import MainSection from '../components/sections/MainSection';
import Navigation from '../components/sections/Navigation';
import SidePart from '../components/SidePart';
import SidePartLogout from '../components/SidePartLogout';
import Footer from '../layout/Footer';
import { createSignal, onCleanup, onMount, Show, createEffect } from 'solid-js';
import { useAuth } from '../layout/AuthContext';
import Profile from './Profile';
import PanelContainer from '../components/PanelContainer';
import SearchResultPage from '../components/SearchResultPage';
import { isSidebarVisible } from '../signal/sidebarStore';
import { createMemo } from 'solid-js';
import {getAllHistoryService} from "../../services/authService";
import {shouldReloadHistory, setShouldReloadHistory} from "../stores/homeStore";
import { addToHistoryService } from "../../services/authService";

// const items = [
//     {
//         name: '9Hz 99Hz 999Hz Infinite Healing Golden WaveㅣVibration of 5 Dimension Frequency',
//         img: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da849933214dfb18e7f4bd68e56d',
//     },
//     {
//         name: 'White Noise 10 Hours',
//         img: 'https://i.scdn.co/image/ab67706f000000025b4d326fee8531fe32efe166',
//     },
//     {
//         name: 'Nhạc Ru Ngủ Cho Người Mất Ngủ, Dễ ngủ, Giảm Stress',
//         img: 'https://mosaic.scdn.co/640/ab67616d00001e0219266a6ed2ebd0fe643ac723ab67616d00001e026f51023755dbf3e9db1215f5ab67616d00001e029b3fb224d88f6914e083ebb7ab67616d00001e02b585ba1ee2b7cfa56185520b',
//     },
//     {
//         name: 'Tiếng Ồn Trắng',
//         img: 'https://mosaic.scdn.co/640/ab67616d00001e0206013115ced3cd702e75a844ab67616d00001e0209848e952392cd4a18c5b29fab67616d00001e02ceec45d05413f26e152fb547ab67616d00001e02e34429d776708f87460cd97e',
//     },
// ];

const Home = () => {
    let scrollContainer;
    const [scrolled, setScrolled] = createSignal(false);
    const { isOpenProfile } = useAuth();
    const { isLoggedIn } = useAuth();
    const { isOpenSearchPage } = useAuth();
    const [imgSize, setImgSize] = createSignal('auto');
    const [scalebtn, setScalebtn] = createSignal();
    const [scaletxt, setScaletxt] = createSignal();
    const [history, setHistory] = createSignal([]);
    const auth = useAuth();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const visibleHistory = () => (showAllHistory() ? history() : history().slice(0, 6));
    const [showAllHistory, setShowAllHistory] = createSignal(false);

    const gridCols = createMemo(() => {
        return isSidebarVisible() ? 'grid-cols-2' : 'grid-cols-3';
    });

    const getHistory = async () => {
        try {
          const history = await getAllHistoryService();
          setHistory(history.historyList);
        } catch (error) {
          console.error('Lỗi lấy bài hát:', error);
        }
    };

    onMount(() => {
        getHistory()
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
    
    createEffect(() => {
        if(shouldReloadHistory()){
            getHistory();
            setShouldReloadHistory(false);
        } 
    });

    //Thêm lịch sử trong db
    const addToHistory = async(song) => {
        await addToHistoryService(song);
    }

    const playSong = (song) => {
        auth.setCurrentSong(song);
        addToHistory();
        setShouldReloadHistory(true);
    };
    
    return (
        <>
            <div classList={{
                'h-[calc(100vh-64px-72px)]': auth.currentSong(),
                'h-[calc(100vh-64px)]': !auth.currentSong(),
                'flex gap-3 px-3 pb-3 pt-1 overflow-hidden w-full bg-base-300': true
            }}>
                <Show when={isLoggedIn()} fallback={<SidePartLogout />}>
                    <SidePart />
                </Show>
                <Show
                    when={isOpenProfile()}
                    fallback={
                        <div
                            ref={(el) => {
                                scrollContainer = el;
                                console.log(
                                    'Scroll container width:',
                                    el?.clientWidth
                                ); // Log tại đây
                            }} // Gán đúng ref cho scrollContainer
                            className={`w-full rounded-md overflow-y-auto ease-linear transition-colors duration-400 ${
                                scrolled()
                                    ? 'bg-base-200'
                                    : 'bg-gradient-to-b from-amber-900/45 to-base-200'
                            }`}
                        >
                            {isOpenSearchPage() && <SearchResultPage />}
                            <Navigation scrolled={scrolled} />
                            <Show when={isLoggedIn()} fallback={<></>}>
                                <div class="text-white p-6 font-sans space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 class="text-2xl font-bold">Lịch sử</h2>
                                        {/* Nút showall */}
                                        <button
                                            className="p-4 text-[#ffffffb3] font-bold text-sm cursor-pointer hover:text-white"
                                            onClick={() => setShowAllHistory(!showAllHistory())}
                                        >
                                            {showAllHistory() ? 'Thu gọn' : 'Hiện tất cả'}
                                        </button>
                                    </div>
                                </div>
                                <div className={`grid ${gridCols()} px-12 gap-3`}>
                                    {visibleHistory().map((item) => (
                                        <div className="card card-side h-12 overflow-hidden rounded-[4px] bg-white/10 hover:bg-white/20 group shadow-md">
                                            <img
                                                style={{
                                                    width: `${imgSize()}px`,
                                                    height: 'auto',
                                                }}
                                                class="transition-all duration-300 object-contain"
                                                src={`${backendUrl}${item.picture_url}`}
                                                alt={item.song_name}
                                            />
                                            <div className="card-body cursor-pointer group-hover:brightness-130 transition-all duration-200 flex-row p-0 w-full items-center justify-between relative">
                                                <div className="flex flex-col w-full pr-2">
                                                    <h2
                                                        className={`card-title text-[12px] pl-3 line-clamp-2 ${scaletxt()}`}
                                                    >
                                                        {item.song_name}
                                                    </h2>
                                                    <h3 className="text-sm text-gray-300 line-clamp-1 break-words pl-3 text-[11px]">
                                                        <a
                                                            href={`/artist/${encodeURIComponent(item.artist?.id)}`}
                                                            className="hover:underline"
                                                        >
                                                            {item.artist?.artist_name}
                                                        </a>
                                                        {Array.isArray(item.artists) &&
                                                            item.artists.map((artist, index) => (
                                                                <span key={index}>
                                                                    {index === 0 ? '' : index === item.artists.length - 1 ? ' và ' : ', '}
                                                                    <a
                                                                        href={`/artist/${encodeURIComponent(artist.id)}`}
                                                                        className="hover:underline"
                                                                    >
                                                                        , {artist.artist_name}  
                                                                    </a>
                                                                </span>
                                                            ))}
                                                    </h3>
                                                </div>

                                                <div className="card-actions pr-3 opacity-0 group-hover:opacity-100 hover:scale-105 hover:brightness-120 transition-all duration-200">
                                                    <button
                                                        className={`btn btn-primary flex shadow-sm size-8 p-auto btn-circle ${scalebtn()}`}
                                                        onClick={() => playSong(item)}
                                                    >
                                                        <svg
                                                            className="size-6"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M6 4l10 6-10 6V4z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Show>
                            <div className="pb-15">
                                <MainSection />
                            </div>
                            <Footer />
                        </div>
                    }
                >
                </Show>

                <Show when={isLoggedIn()} fallback={<></>}>
                    <PanelContainer />
                </Show>
            </div>
        </>
        
    );
};

export default Home;

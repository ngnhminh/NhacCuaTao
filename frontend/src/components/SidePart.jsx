import { createSignal, onCleanup, onMount, For, Show } from 'solid-js';
import SidebarResizer from './SidebarResizer';
import { Menu } from '../../public/Icon';
import { Plus, Search, X } from 'lucide-solid';
import { highlightMatch } from './lib/utils';
import SidebarToggleButton from './SidebarToggleButton';
import { isMinimalView, setIsMinimalView } from '../signal/sidebarStore.js';
import { initFlowbite } from 'flowbite';
import {createPlaylistService, getAllPlaylistIdsService} from "../../services/authService";
import { useNavigate } from "@solidjs/router";

// Dữ liệu mẫu cho nghệ sĩ
const artists = [
    {
        name: 'Đạt G',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101febc4b709c643e32f7bcc5a8d',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Mr.Siro',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101f4371fb198b011bb666a3bfde',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Đen',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101f91d2d39877c13427a2651af5',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Sol7',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101fcc911aa2866d62f7bd5e5894',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Ngơ',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101f6994e627c5b26909bc8ba813',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Binz',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101fc1e37930853ff1686dcdd567',
        date: '16 thg 6, 2024',
    },
    {
        name: 'W/N',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab6761610000101f316c0f0bc6cf3a29c203ab1e',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Guilty Gear Strive',
        type: 'Nghệ sĩ',
        img: 'https://i.scdn.co/image/ab67616d0000b273051d84b6cac537e613b6d5a9',
        date: '16 thg 6, 2024',
    },
];

// Placeholder cho dữ liệu playlist
const placeholderPlaylists = [
    {
        id: 1,
        name: 'Playlist của tôi #1',
        type: 'Danh sách phát',
        img: 'https://i.scdn.co/image/ab67616d0000b273051d84b6cac537e613b6d5a9',
        date: '10 thg 5, 2024',
    },
    {
        id: 2,
        name: 'Nhạc chill cuối tuần',
        type: 'Danh sách phát',
        img: 'https://i.scdn.co/image/ab67616d0000b27394c9217a398f5174757c0c78',
        date: '12 thg 5, 2024',
    }
];

const SidePart = () => {
    let sidebarRef;
    const [sidebarWidth, setSidebarWidth] = createSignal('405px');
    const [isNarrow, setIsNarrow] = createSignal(false);
    const [searchField, setSearchField] = createSignal(false);
    const [viewMode, setViewMode] = createSignal('artists'); // 'artists' hoặc 'playlists'
    const [searchQuery, setSearchQuery] = createSignal('');
    const [playlists, setPlaylists] = createSignal(placeholderPlaylists);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const defaultplaylist = import.meta.env.default_playlist_img;
    const navigate = useNavigate();

    onMount(() => {
        initFlowbite();
        loadPlaylists();
    });

    const loadPlaylists = async () => {
        try {
            const result = await getAllPlaylistIdsService();
            if (result && Array.isArray(result.playlistList)) {
                const formattedPlaylists = result.playlistList.map(playlist => ({
                    id: playlist.id,
                    name: playlist.playlist_name || `Playlist #${playlist.id}`,
                    type: 'Danh sách phát',
                    img: playlist.playlist_picture || "http://localhost:8000/media/playlistsImg/OIP.jpg",
                    onclick: () => handleOpenPlaylist(playlist.id),
                }));
                //đưa lên đầu
                formattedPlaylists.unshift({
                    name: "Bài hát đã thích",
                    type: 'Danh sách phát',
                    img: "http://localhost:8000/media/playlistsImg/OIP.jpg",
                    onclick: () => handleOpenFavlist(), 
                });
                
                setPlaylists(formattedPlaylists);               
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách playlist:", err);
        }
    };

    const toggleSidebar = () => {
        const currentWidth = sidebarRef?.offsetWidth || 0;

        if (currentWidth > 72) {
            setSidebarWidth('72px');
        } else {
            setSidebarWidth('350px');
        }
    };

    onMount(() => {
        const observer = new ResizeObserver(() => {
            const width = sidebarRef?.offsetWidth || 0;

            setIsNarrow(width <= 420);

            if (width === 72 && !isMinimalView()) {
                setIsMinimalView(true);
            } else if (width > 72 && isMinimalView()) {
                setIsMinimalView(false);
            }
        });

        if (sidebarRef) {
            observer.observe(sidebarRef);
        }

        onCleanup(() => observer.disconnect());
    });

    // Lọc danh sách nghệ sĩ hoặc playlist dựa trên giá trị tìm kiếm
    const filteredItems = () => {
        const query = searchQuery().toLowerCase();
        
        if (viewMode() === 'artists') {
            return artists.filter(artist => 
                artist.name.toLowerCase().includes(query)
            );
        } else {
            return playlists().filter(playlist => 
                playlist.name.toLowerCase().includes(query)
            );
        }
    };

    const createPlaylist = async () => {
        try {
            const result = await createPlaylistService();
            console.log("Tạo playlist thành công", result);
            alert("Tạo playlist thành công");
            await loadPlaylists(); // Tải lại danh sách playlist sau khi tạo mới
        } catch (err) {
            console.error("Lỗi khi tạo playlist:", err);
        }
    }

    const handleOpenPlaylist = (id) => {
        navigate(`/playlist/${id}`)
    }

    const handleOpenFavlist = () => {
        navigate(`/favorite`)
    }
    
    return (
        <>
            <aside
                id="default-sidebar"
                ref={(el) => (sidebarRef = el)}
                style={{ width: sidebarWidth() }}
                class={`flex-none relative overflow-hidden max-w-[420px] transition-all duration-300 ease-in rounded-md`}
                aria-label="Sidenav"
            >
                <SidebarResizer
                    sidebarRef={sidebarRef}
                    setSidebarWidth={setSidebarWidth}
                />

                <div
                    className={`flex flex-col items-stretch space-y-3 relative py-4  ${
                        isMinimalView() ? 'px-1' : 'px-4'
                    } h-full dark:bg-base-200`}
                >
                    <div
                        className={`flex items-center justify-between ${
                            isMinimalView() ? 'flex-col gap-3 items-center' : ''
                        }`}
                    >
                        <div className="group flex gap-1 cursor-pointer">
                            <SidebarToggleButton onClick={toggleSidebar} />

                            {!isMinimalView() && (
                                <span className="self-center text-md font-semibold group-hover:text-white transition-all duration-100 whitespace-nowrap dark:text-base-content">
                                    Thư viện
                                </span>
                            )}
                        </div>
                        <div className="relative inline-block">
                            <button
                                className="btn btn-circle size-9 btn-soft btn-primary"
                                data-dropdown-toggle="panel-dropright"
                            >
                                <Plus />
                            </button>

                            <div
                                id="panel-dropright"
                                className="hidden absolute right-[-220px] mt-2 w-56 rounded-lg bg-white shadow-lg z-50"
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={createPlaylist}>
                                        Tạo danh sách phát mới
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {isMinimalView() ? (
                        // Chế độ hiển thị tối giản
                        <div
                            class="text-base-content whitespace-nowrap scrollbar overflow-auto
            [&::-webkit-scrollbar]:w-8"
                        >
                            <For each={viewMode() === 'artists' ? artists : playlists()}>
                                {(item) => (
                                    <div class="flex items-center hover:bg-base-100 cursor-pointer justify-center rounded-lg box-content p-2">
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            class={`size-12 object-cover text-white${
                                                item.type === 'Danh sách phát'
                                                    ? 'rounded-md'
                                                    : 'rounded-full'
                                            }`}
                                        />
                                    </div>
                                )}
                            </For>
                        </div>
                    ) : (
                        <>
                            <div
                                class={`flex justify-between shrink-0 ${
                                    isNarrow() ? 'flex-col gap-2' : 'gap-1'
                                }`}
                            >
                                <div className="flex gap-2 items-center">
                                    <button
                                        className={`btn btn-circle size-9 btn-soft btn-primary transition-all ease-initial duration-200 ${
                                            viewMode() !== '' ? '' : 'w-0 opacity-0'
                                        }`}
                                        onClick={() => setViewMode('')}
                                    >
                                        <X />
                                    </button>

                                    <button
                                        className={`btn ${
                                            viewMode() === 'artists'
                                                ? 'text-primary-content bg-neutral-content'
                                                : 'btn-soft'
                                        } transition-all duration-150 h-9 hover:bg-white/50`}
                                        onClick={() => setViewMode('artists')}
                                    >
                                        Nghệ sĩ
                                    </button>

                                    <button
                                        className={`btn ${
                                            viewMode() === 'playlists'
                                                ? 'text-primary-content bg-neutral-content'
                                                : 'btn-soft'
                                        } transition-all duration-150 h-9 hover:bg-white/50`}
                                        onClick={() => setViewMode('playlists')}
                                    >
                                        Danh sách phát
                                    </button>
                                </div>

                                <div
                                    className={`flex flex-1 justify-between items-center ${
                                        isNarrow() ? '' : ' justify-end'
                                    }`}
                                >
                                    <label
                                        className={`input w-fit transition-all duration-300 ease-out ${
                                            searchField()
                                                ? 'bg-base-100'
                                                : 'bg-transparent'
                                        } ${
                                            isNarrow() ? '' : 'flex-row-reverse'
                                        } hover:bg-base-100 cursor-pointer gap-0 border-none !outline-none`}
                                    >
                                        <button
                                            onClick={() =>
                                                setSearchField(!searchField())
                                            }
                                            className=" "
                                        >
                                            <Search size={16} />
                                        </button>
                                        <input
                                            type="search"
                                            value={searchQuery()}
                                            onInput={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className={`ring-0 p-0 ease-out m-0 placeholder:text-base-content transition-all duration-100 ${
                                                searchField()
                                                    ? 'w-full ml-2 pl-2'
                                                    : 'w-0 opacity-0'
                                            }`}
                                            required
                                            placeholder={`Tìm ${viewMode() === 'artists' ? 'nghệ sĩ' : 'playlist'}`}
                                        />
                                    </label>
                                    <button className="p-0 btn btn-ghost hover:bg-transparent border-none hover:scale-108 transition-all duration-100">
                                        Gần đây
                                        <Menu />
                                    </button>
                                </div>
                            </div>

                            {!isNarrow() && (
                                <div className="grid grid-cols-3 font-semibold text-xs whitespace-nowrap border-b border-base-100 pb-2 mb-2 text-base-content">
                                    <div>Tiêu đề</div>
                                    <div className="flex justify-center">
                                        Đã thêm Ngày
                                    </div>
                                    <div className="flex flex-row-reverse">
                                        Đã phát
                                    </div>
                                </div>
                            )}

                            <div class="text-base-content whitespace-nowrap -ml-2 scrollbar overflow-auto">
                                <Show when={filteredItems().length > 0} fallback={
                                    <div class="flex flex-col items-center justify-center py-8 text-center">
                                        <p class="text-base-content/60">
                                            {viewMode() === 'artists' 
                                                ? 'Không tìm thấy nghệ sĩ nào' 
                                                : 'Không tìm thấy danh sách phát nào'}
                                        </p>
                                        {viewMode() === 'playlists' && (
                                            <button 
                                                onClick={createPlaylist}
                                                class="btn btn-primary btn-sm mt-4"
                                            >
                                                Tạo playlist mới
                                            </button>
                                        )}
                                    </div>
                                }>  
                                    {/* Render danh sách các list */}
                                    <For each={filteredItems()}>
                                        {(item) => (
                                            <div
                                                class={`grid ${
                                                    isNarrow()
                                                        ? 'grid-cols-1'
                                                        : 'grid-cols-3'
                                                } items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-base-100 transition`}
                                            >
                                                <div class="flex items-center space-x-3" onclick = {item.onclick}>
                                                    <img
                                                        src={item.img}
                                                        alt={item.name}
                                                        class={`size-12 object-cover ${
                                                            item.type === 'Danh sách phát'
                                                                ? 'rounded-md'
                                                                : 'rounded-full'
                                                        }`}
                                                    />
                                                    <div>
                                                        <span class="line-clamp-1 text-white">
                                                            {highlightMatch(
                                                                item.name,
                                                                searchQuery()
                                                            )}
                                                        </span>
                                                        <span className="text-[#b3b3b3] text-sm">
                                                            {item.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                {!isNarrow() && (
                                                    <div className="flex justify-center text-sm items-center">
                                                        {item.date}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </For>
                                </Show>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
};

export default SidePart;
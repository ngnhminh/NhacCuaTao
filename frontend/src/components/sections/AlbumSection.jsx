import { useAuth } from '../../layout/AuthContext';
import {getAlbumInformService, 
        getSongsInAlbumIdsService,
        getAllPlaylistIdsService,
        getAllFavoriteSongIdsService,
        getAllArtistAlbumService, addToHistoryService} from '../../../services/authService';
import { onCleanup, Show, createSignal, createEffect, createMemo, onMount } from 'solid-js';
import AlbumCard from '../AlbumCard';
import { useParams } from "@solidjs/router";
import FavouriteButton from '../../components/FavouriteButton';
import {setShouldReloadHistory} from "../../stores/homeStore";

export default function MainSection() {
    const params = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const auth = useAuth();
    const [albumDetail, setAlbumDetail] = createSignal(null);
    const [favoriteSongIds, setFavoriteSongIds] = createSignal([]);
    const [allPlaylistIds, setAllPlaylistIds] = createSignal([]);
    const [loading, setLoading] = createSignal(true);
    const [songs, setSongs] = createSignal([]);
    const [allAlbum, setAllAlbum] = createSignal([]);

    const [openDropdownIndex, setOpenDropdownIndex] = createSignal(null);
    const [songDropdownRefs, setSongDropdownRefs] = createSignal({});

    let dropdownButtonRef;
    const [dropdownOpen, setDropdownOpen] = createSignal(false);

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen());
    };

    const toggleDropdownSong = (index) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdownIndex(openDropdownIndex() === index ? null : index);
    };

    //đóng dropdown khi bấm ra ngoài
    const handleClickOutside = (e) => {
        if (dropdownButtonRef && !dropdownButtonRef.contains(e.target)) {
            setDropdownOpen(false);
        }
    };

    const handleClickOutsideSong = (e) => {
        const currentOpenIndex = openDropdownIndex();
        if (currentOpenIndex !== null) {
            const dropdownRef = songDropdownRefs()[currentOpenIndex];
            if (dropdownRef && !dropdownRef.contains(e.target)) {
                setOpenDropdownIndex(null);
            }
        }
    };

    onMount(() => {
        // Thêm lắng nghe sự kiện khi bấm r angoaif
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('click', handleClickOutsideSong);
        // Khi componetn hủy loại sự kiện lắng nghe
        onCleanup(() => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('click', handleClickOutsideSong);
        });
    });

    const convert_seconds_to_time = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return minutes + " phút " + remainingSeconds + " giây";
    };

    //Chuyển đổi định dạng từ yyyy/mm/dd sáng xx ngày xx tháng xx năm
    function formatVietnameseDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day} tháng ${month}, ${year}`;
    }

    function GetYearOnly(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        return `${year}`;
    }

    const reloadFavoriteList = async () => {
            try{
                const result = await getAllFavoriteSongIdsService();
                setFavoriteSongIds(result.songList);
            }catch (err) {
              console.error("Lỗi khi load danh sách yêu thích:", err);
            }
        }
    
    const reloadAllPlayList = async () => {
        try{
            const result = await getAllPlaylistIdsService();
            setAllPlaylistIds(result.playlistList);
        }catch (err) {
        console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }
    // const songs = [
    //     {
    //         id: 1,
    //         title: 'Rock xuyên màn đêm',
    //         artist: 'Bức tường',
    //         duration: '3:45',
    //     },
    //     {
    //         id: 2,
    //         title: 'Tâm hồn của đá',
    //         artist: 'Bức tường',
    //         duration: '4:12',
    //     },
    //     {
    //         id: 3,
    //         title: 'Cơn mưa hoang dã',
    //         artist: 'Bức tường',
    //         duration: '5:03',
    //     },
    //     {
    //         id: 4,
    //         title: 'Ngày hôm qua',
    //         artist: 'Bức tường',
    //         duration: '4:50',
    //     },
    //     {
    //         id: 5,
    //         title: 'Chim hót trời xanh',
    //         artist: 'Bức tường',
    //         duration: '5:03',
    //     },
    //     {
    //         id: 6,
    //         title: 'Giọt đắng',
    //         artist: 'Bức tường',
    //         duration: '4:19',
    //     },
    // ];

    // const albums = [
    //     {
    //         imgSrc: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Con đường không tên',
    //         year: '2020',
    //     },
    //     {
    //         imgSrc: 'https://i.scdn.co/image/ab67616d00001e020c6211ec7b9c2bb396ef10cb',
    //         title: 'Cân bằng',
    //         year: '2023',
    //     },
    //     {
    //         imgSrc: 'https://i.scdn.co/image/ab67616d00001e02bb9722d7560ee2545864029a',
    //         title: 'Cơn mưa tháng 5 (Special edition 2020)',
    //         year: '2020',
    //     },
    //     {
    //         imgSrc: 'https://i.scdn.co/image/ab67616d00001e0200953ab29a88f444d582c9c7',
    //         title: 'Đường đến đỉnh vinh quang',
    //         year: '2013',
    //     },
    //     {
    //         imgSrc: 'https://i.scdn.co/image/ab67616d00001e020ecd1c9f2bd6b3e99be97b79',
    //         title: 'Nơi đó có chúng ta thuộc về nhau',
    //         year: '2023',
    //     },
    // ];

    const reloadAllAlbum = async (artistId) => {
        try{
            const result = await getAllArtistAlbumService(artistId);
            console.log("thông tin hàm allALbum " + result)
            setAllAlbum(result.albumList);
        }catch (err) {
        console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }

    //Hàm chuyển đổi thời gian
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };
    
    createEffect(() => {
        const albumId = params.id;
        getData(albumId);
        getSongs(albumId);
        reloadFavoriteList();
        reloadAllPlayList();
        // Cleanup nếu cần hủy socket hay setInterval khi component bị huỷ
        onCleanup(() => {
            // cleanup code nếu cần
        });
    });

    const artistId = createMemo(() => albumDetail()?.artist?.id);

    createEffect(() => {
        if (artistId()) {
            reloadAllAlbum(artistId());
        }
    });

    const getData = async (id) => {
        setLoading(true);
        try{
            const result = await getAlbumInformService(id);
            setAlbumDetail(result.album_data)
            console.log(result.album_data)
        }catch(err){
            console.error(err);
            alert("Lấy thông tin thất bại");
        }finally {
            setLoading(false);
        }
    }

    const getSongs = async (id) => {
        setLoading(true);
        try {
            const result = await getSongsInAlbumIdsService(id);
            setSongs(result.songInAlbum)
        } catch (error) {
            console.error("Lỗi không lấy được danh sách bài hát của nghệ sĩ");
            return [];
        }finally{
            setLoading(false);
        }
    }

    const addToHistory = async(song) => {
        await addToHistoryService(song);
    }

    const playSong = (song) => {
        auth.setCurrentSong(song);
        addToHistory(song);
        setShouldReloadHistory(true);
    };
    
    const handleDownloadSong = (songId) => {
        const url = `${backendUrl}/api/songs/SongGetView/?action=downloadSong&songId=${songId}`;
        window.open(url, "_blank"); 
    };
    
    const playAllAlbum = () => {
        const playlist = songs();
        auth.setCurrentPlaylist(playlist);
        auth.startPlaylist(playlist, 0);
        // setIsPlaying(true); // nếu muốn phát ngay
    };


    return (
        <Show when = {!loading()}
            fallback = {
            <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div class="loading loading-spinner text-white w-14 h-14"></div>
            </div>
            }
        >
            <div class="text-white pt-7 pb-4">
                <Show when={auth.isLoggedIn()}>
                    <div className="flex px-4 pb-4">
                        <button className="mr-4 cursor-pointer hover:scale-[1.02] transition">
                            <img
                                className="rounded-sm w-[144px] h-[144px] shadow-[0_4px_60px_rgba(0,0,0,0.5)]"
                                src={`${backendUrl}${albumDetail()?.album_picture || "/default.png"}`} alt="Lỗi ảnh"
                            />
                        </button>
                        <div className="flex flex-1 flex-col flex-nowrap justify-end">
                            <span className="text-sm font-normal flex items-center">
                                EP
                            </span>
                            <span className="">
                                <h1 className="text-5xl font-extrabold capitalize">
                                    {albumDetail()?.album_name}
                                </h1>
                            </span>
                            <div className="flex flex-wrap items-center mt-2 text-[#ffffffb3]">
                                <div className="whitespace-nowrap grid grid-flow-col gap-1 items-center">
                                    <div className="w-6 h-6">
                                        <img
                                            className="rounded-[50%]"
                                            src={`${backendUrl}${albumDetail()?.artist.avatar_url || "/default.png"}`} alt="Lỗi ảnh"
                                        />
                                    </div>
                                    <span className="text-sm font-bold cursor-pointer hover:underline">
                                        <a className="text-white">{albumDetail()?.artist.artist_name}</a>
                                    </span>
                                </div>
                                <span className="text-[#ffbdb9] text-sm font-normal mx-1 whitespace-pre">
                                    •
                                </span>
                                <span className="text-[#ffbdb9] text-sm font-normal whitespace-nowrap">
                                    {albumDetail()?.release_date}
                                </span>
                                <span className="text-[#ffbdb9] text-sm font-normal mx-1 whitespace-pre">
                                    •
                                </span>
                                <div className="flex whitespace-nowrap items-center">
                                    <span className="text-[#ffbdb9] text-sm font-normal whitespace-nowrap">
                                        {albumDetail()?.song_number} bài hát
                                    </span>
                                    <span className="text-[#ffbdb9] text-sm font-normal whitespace-pre">
                                        ,{' '}
                                    </span>
                                    <span className="text-[#ffbdb9] text-sm font-normal whitespace-nowrap">
                                        {convert_seconds_to_time(albumDetail()?.songs_duration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start p-6">
                        <div className="flex flex-row items-center">
                            <div className="shrink mr-4">
                                <button className="self-center rounded-[9999px] cursor-pointer inline-block text-center align-middle will-change-transform hover:scale-[1.04]"  onClick={()=>{playAllAlbum()}}>
                                    <span className="h-14 w-14 items-center bg-[#1ed760] rounded-[9999px] text-black flex justify-center hover:bg-[#3be477]">
                                        <span aria-hidden="true">
                                            <svg
                                                role="img"
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                class="w-6 h-6 fill-current text-black"
                                            >
                                                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                                            </svg>
                                        </span>
                                    </span>
                                </button>
                            </div>
                            <button className="mr-4 cursor-pointer py-3 text-[#b3b3b3] hover:text-white hover:scale-[1.04]">
                                <span aria-hidden="true">
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        className="w-8 h-8 fill-current"
                                    >
                                        <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                                        <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
                                    </svg>
                                </span>
                            </button>
                            <div className="relative">
                                <button 
                                    type="button"
                                    className="mr-4 cursor-pointer py-3 text-[#b3b3b3] hover:text-white hover:scale-[1.04]"
                                    onClick={toggleDropdown}
                                    ref={dropdownButtonRef}
                                >
                                    <span aria-hidden="true">
                                        <svg
                                            role="img"
                                            viewBox="0 0 24 24"
                                            className="w-8 h-8 fill-current"
                                        >
                                            <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                        </svg>
                                    </span>
                                </button>
                                
                                <Show when={dropdownOpen()}>
                                    <div className="absolute z-50 w-64 mt-2 bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-700">
                                        <div className="p-3 text-sm text-white font-medium">
                                            Cài đặt
                                        </div>
                                        <ul className="py-2 text-sm text-gray-200">
                                            <li onClick={() => handleRemovePlaylist()}>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 hover:bg-gray-600 hover:text-white"
                                                >
                                                   Thêm vào Mục yêu thích
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Show>
                            </div>
                        </div>
                        <div className="flex flex-[1] gap-2 justify-end">
                            <button className="flex items-center rounded-sm text-[#ffffffb3] h-8 gap-2 cursor-pointer hover:text-white">
                                <span className="text-start whitespace-nowrap text-sm font-normal">
                                    Danh sách
                                </span>
                                <svg
                                    role="img"
                                    viewBox="0 0 16 16"
                                    className="w-4 h-4 fill-current"
                                >
                                    <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="px-6">
                        <div className="h-9 px-6 mb-4 border-b border-[#b3b3b3]">
                            <div className="grid grid-cols-[16px_minmax(120px,_var(--col1,_4fr))_minmax(120px,_var(--col2,_1fr))] gap-4 h-9">
                                <div className="flex justify-self-end items-center">
                                    <div className="text-[#b3b3b3]">
                                        <div className="">#</div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="text-[#b3b3b3]">
                                        <div className="text-sm font-normal">
                                            Tiêu đề
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end">
                                    <div className="text-[#b3b3b3]">
                                        <div className="mr-5">
                                            <svg
                                                role="img"
                                                viewBox="0 0 16 16"
                                                className="w-4 h-4 fill-current"
                                            >
                                                <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
                                                <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {songs().map((song, index) => (
                            <div className="h-14 pl-6 mb-4 hover:bg-[#ffffff1a] cursor-pointer rounded-sm group" onClick={() => playSong(song)}>
                                <div className="grid grid-cols-[16px_minmax(120px,_var(--col1,_4fr))_minmax(120px,_var(--col2,_1fr))] gap-4 h-14">
                                    <div className="flex justify-self-end items-center w-full">
                                        <div
                                            className={
                                                index === 0
                                                    ? 'text-[#1ed760]'
                                                    : 'text-[#b3b3b3]'
                                            }
                                        >
                                            <div className="group-hover:hidden">
                                                {index + 1}
                                            </div>
                                            <button className="text-white hidden group-hover:block">
                                                <svg
                                                    role="img"
                                                    viewBox="0 0 24 24"
                                                    className="w-4 h-4 fill-current"
                                                >
                                                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="text-[#b3b3b3]">
                                            <div className="grid items-center font-normal pr-2">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        className="w-10 h-10 rounded-sm"
                                                        src={`${backendUrl}${song.picture_url}`}
                                                    />
                                                    <div className="flex flex-col">
                                                        <a
                                                            href="#"
                                                            className={`text-base capitalize hover:underline ${
                                                                index === 0
                                                                    ? 'text-[#1ed760]'
                                                                    : 'text-white'
                                                            }`}
                                                        >
                                                            {song.song_name}
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="text-sm hover:underline hover:text-white"
                                                        >
                                                            {song.artist.artist_name}
                                                            {song.artists?.map((artist, index) => (
                                                                <span key={index} className="mr-2">
                                                                    {artist.artist_name}
                                                                </span>
                                                            ))}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <FavouriteButton
                                            className="text-[#b3b3b3] cursor-pointer py-2 mr-3 opacity-0 group-hover:opacity-100"
                                            songId={song.id} favoriteSongIds={favoriteSongIds()} 
                                            reloadFavoriteList={reloadFavoriteList} 
                                            position={"dropdown dropdown-end dropdown-bottom top-3 "}
                                            playlists = {allPlaylistIds()}
                                            reloadPlaylistList={reloadAllPlayList}
                                        />
                                        <div className="text-[#ffbdb9] text-sm font-normal mr-3">
                                            {formatTime(song.duration)}
                                        </div>
                                        <div className="relative">
                                            <button 
                                                className="text-[#b3b3b3] cursor-pointer py-2 mr-3 opacity-0 group-hover:opacity-100"
                                                onClick={toggleDropdownSong(index)}
                                                ref={(el) => {
                                                    const refs = songDropdownRefs();
                                                    refs[index] = el;
                                                    setSongDropdownRefs(refs);
                                                }}
                                            >
                                                <svg
                                                    role="img"
                                                    viewBox="0 0 16 16"
                                                    className="w-4 h-4 fill-current"
                                                >
                                                    <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                                </svg>
                                            </button>
                                            <Show when={openDropdownIndex() === index}>
                                                <div className="absolute z-50 w-64 mt-2 right-0 bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-700">
                                                    <ul className="py-2 text-sm text-gray-200">
                                                        <li
                                                            onClick={() => handleDownloadSong(song.id)}
                                                            className="block px-4 py-2 hover:bg-gray-600 hover:text-white cursor-pointer"
                                                        >
                                                            Tải về
                                                        </li>
                                                    </ul>
                                                </div>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between mt-8">
                            <div>
                                <p className="text-[#b3b3b3] text-sm font-normal">
                                    {formatVietnameseDate(albumDetail()?.release_date)}
                                </p>
                                <div className="text-[#b3b3b3]">
                                    <p className="text-[11px] font-normal">
                                        © {GetYearOnly(albumDetail()?.release_date)} {albumDetail()?.artist.artist_name}
                                    </p>
                                    <p className="text-[11px] font-normal">
                                        ℗ {GetYearOnly(albumDetail()?.release_date)} {albumDetail()?.artist.artist_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-6">
                        <section className="mt-12 flex max-w-full max-h-full flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold cursor-pointer hover:underline">
                                    <a className="text-2xl">
                                        Album khác của {albumDetail()?.artist.artist_name}
                                    </a>
                                </div>
                                <div className="text-[#b3b3b3] font-bold cursor-pointer hover:underline">
                                    <a className="text-sm">
                                        Xem danh sách đĩa nhạc
                                    </a>
                                </div>
                            </div>
                            <div className="grid auto-rows-auto grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                {allAlbum().map((album, index) => (
                                    <AlbumCard key={index} {...album} />
                                ))}
                            </div>
                        </section>
                    </div>
                </Show>
            </div>
        </Show>     
    );
}

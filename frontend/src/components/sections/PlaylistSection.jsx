import { useAuth } from '../../layout/AuthContext';
import { onMount, Show, createSignal, createEffect, createMemo, onCleanup } from 'solid-js';
import PlaylistCard from '../PlaylistCard';
import { useParams } from "@solidjs/router";
import {getSongsInPlaylistIdsService, 
        getPlaylistInformService, 
        getAllFavoriteSongIdsService, 
        getAllPlaylistIdsService,
        uploadPlaylistAvatarService,
        updatePlaylistInformService,
        removePlaylistService, addToHistoryService, } from "../../../services/authService";
import FavouriteButton from '../../components/FavouriteButton';
import { setShouldReloadPlaylists } from '../../stores/playlistStore';
import { initFlowbite } from 'flowbite';
import { useNavigate } from "@solidjs/router";
import {setShouldReloadHistory} from "../../stores/homeStore";

export default function MainSection() {
    const params = useParams();
    const [loading, setLoading] = createSignal(true);
    const [songs, setSongs] = createSignal([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const auth = useAuth();
    const navigate = useNavigate();
    let fileInputRef;
    let dropdownButtonRef; 

    const [playlistDetail, setPlaylistDetail] = createSignal(null);

    const [dropdownOpen, setDropdownOpen] = createSignal(false); 
    const [openDropdownIndex, setOpenDropdownIndex] = createSignal(null);
    const [songDropdownRefs, setSongDropdownRefs] = createSignal({});

    const [favoriteSongIds, setFavoriteSongIds] = createSignal([]);
    const [allPlaylistIds, setAllPlaylistIds] = createSignal([]);

    const visiblePlaylists = () => (showAllPlaylists() ? otherPlaylists() : otherPlaylists().slice(0, 4));
    const [showAllPlaylists, setShowAllPlaylists] = createSignal(false);

    const [showDetail, setShowDetail] = createSignal(false);

    const [editField, setEditField] = createSignal(null);

    const [tempData, setTempData] = createSignal({
            id: params.id,
            playlist_name: '',
        });

    const convert_seconds_to_time = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return minutes + " phút " + remainingSeconds + " giây";
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
    
    //Memo phản ứng lại mổi khi allPlaylistIds() thay đổi
    const otherPlaylists = createMemo(() =>
        allPlaylistIds().filter(p => p.id !== params.id)
    );
    
    console.log(otherPlaylists)

    //Hàm chuyển đổi thời gian
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Toggle dropdown function
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
        initFlowbite();

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('click', handleClickOutsideSong);

        onCleanup(() => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('click', handleClickOutsideSong);
        });
    });

    createEffect(() => {
        const playlistId = params.id;
        getData(playlistId);
        getSongs(playlistId);
        reloadFavoriteList();
        reloadAllPlayList();
    });
    
    const getData = async (id) => {
            setLoading(true);
            try{
                const result = await getPlaylistInformService(id);
                setPlaylistDetail(result.playlistDetail)
                console.log(result.playlistDetail)
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
                const result = await getSongsInPlaylistIdsService(id);
                setSongs(result.songInPlaylist)
            } catch (error) {
                console.error("Lỗi không lấy được danh sách bài hát của nghệ sĩ");
                return [];
            }finally{
                setLoading(false);
            }
        }
    
    function handleChange(field, value) {
        setTempData((prev) => ({ ...prev, [field]: value }));
    }

    //Đổi avatar playlist
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('playlistId', params.id);
        setLoading(true);
        try {
            const res = await uploadPlaylistAvatarService(formData);
            // await refetch();
            await getData(params.id);
            setShouldReloadPlaylists(true);
        } catch (err) {
            console.error(err);
            alert('Upload thất bại');
        } finally {
            setLoading(false);
        }
    };

    const addToHistory = async(song) => {
        await addToHistoryService(song);
    }

    const playSong = (song) => {
        auth.setCurrentSong(song);
        addToHistory(song);
        setShouldReloadHistory(true);
    };

    const saveChanges = async () => {
        try{
            const result = await updatePlaylistInformService(tempData());
            if(result.updated){
                alert('Lưu thông tin thành công');
                await getData(params.id);
                setShouldReloadPlaylists(true);
                setEditField(null);
            }else{
                console.error("Lỗi gì kìa")
            }
        }catch(error){
            console.error("Lỗi lưu thông tin playlist" + error);
        }
    };

    const cancelEdit = () => {
        setTempData({
            playlist_name: playlistDetail()?.playlist_name,
        });
        setEditField(null);
    };

    const handleRemovePlaylist = async () => {
        try{
            const result = await removePlaylistService(params.id);
            if(result.removed){
                alert("Xóa playlist thành công")
                setShouldReloadPlaylists(true);
                navigate("/")
            }
        }catch(error){
            console.error(error)
        }
    }

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
                    <div className="flex px-4 pb-4" onClick={() => setShowDetail(true)} >
                        <button 
                            className="mr-4 cursor-pointer hover:scale-[1.02] transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.click();
                            }}
                        >
                            <img
                                className="rounded-sm w-[144px] h-[144px] shadow-[0_4px_60px_rgba(0,0,0,0.5)]"
                                src={`${backendUrl}${playlistDetail()?.playlist_picture || "/default.png"}`} alt="Lỗi ảnh"
                            />
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={(el) => (fileInputRef = el)}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <div className="flex flex-1 flex-col flex-nowrap justify-end">
                            <span className="text-sm font-semibold flex items-center">
                                Public playlist
                            </span>
                            <span className="">
                                <h1 className="text-5xl font-extrabold capitalize">
                                    {playlistDetail()?.playlist_name}
                                </h1>
                            </span>
                            <div className="flex flex-wrap items-center mt-2 text-[#ffffffb3]">
                                <div className="whitespace-nowrap grid grid-flow-col gap-1 items-center">
                                <div className="w-6 h-6">
                                    <img
                                        className="rounded-[50%]"
                                        src={`${backendUrl}${playlistDetail()?.user?.avatar_url || "/default.png"}`}
                                    />
                                </div>
                                <span className="text-sm font-semibold cursor-pointer hover:underline">
                                    <a className="text-white">{playlistDetail()?.user?.full_name}</a>
                                </span>
                                </div>
                                <span className="text-[#ffbdb9] text-sm font-normal mx-1 whitespace-pre">
                                    •
                                </span>
                                <span className="text-[#ffbdb9] text-sm font-normal whitespace-nowrap">
                                    2020
                                </span>
                                <span className="text-[#ffbdb9] text-sm font-normal mx-1 whitespace-pre">
                                    •
                                </span>
                                <div className="flex whitespace-nowrap items-center">
                                    <span className="text-[#ffbdb9] text-sm font-normal whitespace-nowrap">
                                        {playlistDetail()?.song_number} bài hát
                                    </span>
                                    <span className="text-[#ffbdb9] text-sm font-normal whitespace-pre">
                                        ,{' '}
                                    </span>
                                    <span className="text-[#ffbdb9] text-sm font-normal whitespace-nowrap">
                                        {convert_seconds_to_time(playlistDetail()?.songs_duration)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Show when={showDetail()}>
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                            <div className="bg-[#181818] rounded-2xl w-[524px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-auto text-[#b3b3b3] shadow-2xl animate-scaleIn">
                                {/* Header */}
                                <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a]">
                                    <h3 className="text-2xl font-bold text-white">Chi Tiết Thông Tin</h3>
                                    <button
                                        className="rounded-full h-8 w-8 flex justify-center items-center hover:bg-[#2a2a2a] transition-colors"
                                        onClick={() => setShowDetail(false)}
                                    >
                                        <svg role="img" viewBox="0 0 16 16" className="h-4 w-4 fill-white">
                                            <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-6">
                                    {/* Avatar và Full Name */}
                                    <div className="flex items-center gap-6">
                                        <img
                                            className="w-24 h-24 rounded-full object-cover border-2 border-[#333] shadow-md"
                                            src={`${backendUrl}${playlistDetail()?.playlist_picture || "/default.png"}`}
                                        />
                                        <div className="flex-1 text-white">
                                            <Show when={editField() === 'playlist_name'} fallback={
                                                <>
                                                    <p><span className="font-semibold">Tên: </span>{playlistDetail()?.playlist_name}</p>
                                                    <button
                                                        onClick={() => setEditField('playlist_name')}
                                                        className="text-sm text-blue-500 hover:underline mt-1"
                                                    >
                                                        ✏️ Chỉnh sửa
                                                    </button>
                                                </>
                                            }>
                                                <input
                                                    className="border border-[#444] bg-[#2a2a2a] text-white rounded px-3 py-2 w-full"
                                                    value={tempData().playlist_name}
                                                    onInput={(e) => handleChange('playlist_name', e.target.value)}
                                                />
                                            </Show>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <Show when={editField()}>
                                        <div className="flex justify-end gap-4 mt-4">
                                            <button
                                                onClick={cancelEdit}
                                                className="bg-[#333] text-white px-4 py-2 rounded hover:bg-[#444]"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={saveChanges}
                                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </Show>

                                    {/* Ghi chú cuối */}
                                    <p className="text-xs text-center text-[#777] pt-4">
                                        Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh này.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Show>

                    <div className="flex items-start p-6">
                        <div className="flex flex-row items-center">
                            <div className="shrink mr-4">
                                {/* Nút play */}
                                <button className="self-center rounded-[9999px] cursor-pointer inline-block text-center align-middle will-change-transform hover:scale-[1.04]" onClick={()=>{playAllAlbum()}}>
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
                                                   Xóa
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
                                                            className={`text-base capitalize font-semibold hover:underline ${
                                                                index === 0
                                                                    ? 'text-[#1ed760]'
                                                                    : 'text-white'
                                                            }`}
                                                        >
                                                            {song.song_name}
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="text-sm hover:underline hover:text-white font-semibold"
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
                                        <div className="text-[#ffbdb9] text-sm font-semibold mr-3">
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
                    </div>

                    <div className="px-6">
                        <section className="mt-12 flex max-w-full max-h-full flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold cursor-pointer hover:underline">
                                    {otherPlaylists().length >= 1 && (
                                    <a className="text-2xl">
                                        {/* Playlist khác của {playlistDetail()?.user.full_name} */}
                                        Playlist khác của bạn
                                    </a>
                                    )}
                                </div>
                                <span className="text-[#b3b3b3] font-bold text-sm hover:underline cursor-pointer">
                                    {otherPlaylists().length >= 4 && (
                                        <button
                                            className="p-4 text-[#ffffffb3] font-bold text-sm cursor-pointer hover:text-white"
                                            onClick={() => setShowAllPlaylists(!showAllPlaylists())}
                                        >
                                            {showAllPlaylists() ? 'Thu gọn' : 'Xem thêm danh sách playlist'}
                                        </button>
                                    )}
                                </span>
                            </div>
                            <div className="grid auto-rows-auto grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                {visiblePlaylists().map((playlist, index) => (
                                    <PlaylistCard key={index} {...playlist} />
                                ))}
                            </div>
                        </section>
                    </div>
                </Show>
            </div>
        </Show>
    );
}
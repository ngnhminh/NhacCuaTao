// components/Playbar.tsx
import { createEffect, createSignal, onMount } from 'solid-js';
import { useAuth } from '../layout/AuthContext';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Shuffle,
    Maximize,
    AlignJustify,
    MinimizeIcon,
    ChevronDown,
    ChevronUp,
} from 'lucide-solid';
import {
    Device,
    Thumbnail,
    Playing,
    Replay,
    ReplayAgain,
} from '../../public/Icon';
import { useActive, useFullscreen } from '../components/lib/utils';
import { Mic } from './../../public/Icon';
import FavouriteButton from '../components/FavouriteButton';
import { setIsSidebarVisible } from '../signal/sidebarStore';
import {getAllFavoriteSongIdsService, getAllPlaylistIdsService, increaseViewCountService} from "../../services/authService";

export default function Playbar() {
    const [isPlaying, setIsPlaying] = createSignal(false);
    const [progress, setProgress] = createSignal(0);
    const [volume, setVolume] = createSignal(70);
    const { isFullscreen, toggle } = useFullscreen();
    const auth = useAuth();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [favoriteSongIds, setFavoriteSongIds] = createSignal([]);
    const [allPlaylistIds, setAllPlaylistIds] = createSignal([]);
    
    const [currentTime, setCurrentTime] = createSignal(0);
    const [duration, setDuration] = createSignal(0);
    const [hasCounted, setHasCounted] = createSignal(false);

    // Ref cho audio element
    let audioRef;

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
            console.error("Lỗi khi load danh sách playlist:", err);
        }
    }
      
    //Hàm tăng lượt nghe
    createEffect(() => {
        if (currentTime() >= 2 && !hasCounted()) {
            increaseViewCount(auth.currentSong().id);
            setHasCounted(true);
        }
    });

    onMount(() => {
        reloadFavoriteList();
        reloadAllPlayList();
        
        // Đặt âm lượng ban đầu cho audio
        if (audioRef) {
            audioRef.volume = volume() / 100;
        }
    });

    // Reset hasCounted khi thay đổi bài hát
    createEffect(() => {
        // Theo dõi thay đổi của currentSong
        auth.currentSong();
        setHasCounted(false);
        setCurrentTime(0);
        setProgress(0);
        // Tự động phát khi thay đổi bài hát nếu đang trong trạng thái phát
        if (isPlaying() && audioRef) {
            audioRef.play().catch(err => {
                console.error("Lỗi khi tự động phát bài hát mới:", err);
                setIsPlaying(false);
            });
        }
    });
    createEffect(() => {
        // Theo dõi thay đổi của playlist
        auth.currentPlaylist();
        setHasCounted(false);
        setCurrentTime(0);
        setProgress(0);
        // Tự động phát khi thay đổi bài hát nếu đang trong trạng thái phát
        if (isPlaying() && audioRef) {
            audioRef.play().catch(err => {
                console.error("Lỗi khi tự động phát bài hát mới:", err);
                setIsPlaying(false);
            });
        }
    });
    
    //Tăng lượt nghe
    const increaseViewCount = async (id) => {
        try{
            const result = await increaseViewCountService(id);
        }catch(error){
            console.error("Thêm lượt nghe thất bại:", error);
        }
    }

    const handleVolume = (e) => {
        const value = +e.target.value;
        setVolume(value);
        if (audioRef) {
            audioRef.volume = value / 100;
        }
    };

    const handleProgress = (e) => {
        const value = +e.target.value;
        setProgress(value);

        if (audioRef && audioRef.duration) {
            audioRef.currentTime = (value / 100) * audioRef.duration;
        }
    };

    const shuffleState = useActive(false);
    const micState = useActive(false);
    const collapse = useActive(false);

    const [activeControl, setActiveControl] = createSignal(null);

    const [replayMode, setReplayMode] = createSignal(0); // 0 = off, 1 = all, 2 = one

    const toggleReplayMode = () => {
        setReplayMode((prev) => (prev + 1) % 3); // loop 0 -> 1 -> 2 -> 0...
        
        // Cập nhật thuộc tính loop của audio element
        if (audioRef) {
            audioRef.loop = replayMode() === 2; // Chỉ lặp lại nếu ở chế độ "one"
        }
    };

    const togglePlay = () => {
        if (!audioRef) return;

        if (isPlaying()) {
            audioRef.pause();
            setIsPlaying(false);
        } else {
            audioRef.play().catch(err => {
                console.error("Lỗi khi phát nhạc:", err);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        }
    };
    
    // Xử lý chuyển bài trước đó
    const handlePrevious = () => {
        auth.playPreviousSong();
        console.log("Chuyển đến bài hát trước");
    };
    
    // Xử lý chuyển bài tiếp theo
    const handleNext = () => {
        auth.playNextSong();
        console.log("Chuyển đến bài hát tiếp theo");
    };

    // Xử lý khi một bài hát phát xong
    const handleAudioEnded = () => {
        setIsPlaying(false);
        
        // Nếu ở chế độ replay all, chơi bài tiếp theo
        if (replayMode() === 1) {
            handleNext();
            if (audioRef) {
                audioRef.play().catch(err => {
                    console.error("Lỗi khi tự động phát bài hát tiếp theo:", err);
                });
            }
        } 
        else if (shuffleState.active()) {
            playRandomSong();
        }
    };

    // Hàm phát ngẫu nhiên
    const playRandomSong = () => {
        if (auth.currentPlaylist().length <= 1) return;
        
        // Tạo index ngẫu nhiên khác với index hiện tại
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * auth.currentPlaylist().length);
        } while (randomIndex === auth.currentIndex() && auth.currentPlaylist().length > 1);
        
        // Cập nhật index và bài hát hiện tại
        const song = auth.currentPlaylist()[randomIndex];
        auth.startPlaylist(auth.currentPlaylist(), randomIndex);
        
        // Tự động phát
        if (audioRef) {
            audioRef.play().catch(err => {
                console.error("Lỗi khi phát bài hát ngẫu nhiên:", err);
            });
        }
    };
    
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <div class=" h-[72px] sticky bottom-0 left-0 right-0 bg-base-300 text-base-content p-2 z-2 grid grid-cols-10">
            {/* Left: Song Info */}
            <div class="card card-side col-span-3 gap-4">
                <figure className="relative">
                    <button
                        onClick={collapse.toggleActive}
                        className="btn btn-soft btn-circle size-fit p-1 border-none hover:scale-110 hover:text-white hover:opacity-100 opacity-0 absolute top-2 right-1"
                    >
                        {collapse.active() ? (
                            <ChevronDown size={18} />
                        ) : (
                            <ChevronUp size={18} />
                        )}
                    </button>
                    <img
                        src={`${backendUrl}${auth.currentSong().picture_url}`}
                        alt="Album cover"
                        class="size-[56px] rounded-[4px]"
                    />
                </figure>
                <div className="flex flex-col justify-center">
                    <a href="#" className="hover:underline">
                        <p class="text-sm font-semibold">{auth.currentSong().song_name}</p>
                    </a>
                    <a href="#" className="hover:underline">
                        <p class="text-xs text-zinc-400">{auth.currentSong().artist.artist_name}</p>
                    </a>
                </div>

                <FavouriteButton 
                    songId={auth.currentSong().id} favoriteSongIds={favoriteSongIds()} 
                    reloadFavoriteList={reloadFavoriteList} 
                    position={"dropdown dropdown-up dropdown-top top-3 "}
                    playlists = {allPlaylistIds()}
                    reloadPlaylistList={reloadAllPlayList}
                />
            </div>

            {/* Center: Controls */}
            <div class="flex flex-col items-center justify-center col-span-4 gap-1 ">
                <div class="flex items-center gap-1">
                    <div class="flex flex-col items-center ">
                        <button
                            onClick={shuffleState.toggleActive}
                            className={`btn bg-transparent p-0 size-fit border-none transition-all duration-100 hover:scale-103 ${
                                shuffleState.active()
                                    ? 'text-primary'
                                    : 'hover:text-white'
                            }`}
                        >
                            <Shuffle size={20} />
                        </button>
                        <div
                            className={`size-1 transition-all duration-100  mt-1 bg-primary rounded-full ${
                                shuffleState.active()
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            }`}
                        ></div>
                    </div>

                    <button 
                        className="btn size-fit bg-transparent border-none hover:scale-105 hover:text-white hover:fill-white flex flex-col items-center fill-base-content"
                        onClick={handlePrevious}
                    >
                        <SkipBack size={20} fill="" />
                        <div class="size-1 opacity-0"></div>
                    </button>
                    <div className="flex flex-col items-center">
                        <button
                            class="btn btn-circle hover:scale-103 hover:bg-white transition-all duration-75 bg-base-content text-base-300 border-none fill-base-300"
                            onClick={togglePlay}
                        >
                            {isPlaying() ? (
                                <Pause size={20} fill="" />
                            ) : (
                                <Play size={20} fill="" />
                            )}
                        </button>
                        <div class="size-1 opacity-0"></div>
                    </div>

                    <button 
                        className="btn bg-transparent hover:scale-105 hover:text-white hover:fill-white border-none flex flex-col items-center fill-base-content"
                        onClick={handleNext}
                    >
                        <SkipForward size={20} fill="" />
                        <div class="size-1 opacity-0"></div>
                    </button>

                    <div class="flex flex-col items-center justify-center">
                        <button
                            onClick={toggleReplayMode}
                            class={`btn bg-transparent p-0 size-fit border-none transition-all duration-100 hover:scale-103 ${
                                replayMode() === 0
                                    ? 'hover:text-white'
                                    : 'text-primary'
                            }`}
                        >
                            {/* Swap icon theo chế độ */}
                            {replayMode() === 2 ? (
                                <ReplayAgain size={20} fill="" />
                            ) : (
                                <Replay size={20} />
                            )}
                        </button>
                        <div
                            class={`size-1 transition-all duration-100 mt-1 bg-primary rounded-full ${
                                replayMode() === 0 ? 'opacity-0' : 'opacity-100'
                            }`}
                        ></div>
                    </div>
                </div>
                {/* Progress Bar */}
                <div class="flex items-center gap-2 w-full">
                    <span class="text-xs text-zinc-400">
                        {formatTime(currentTime())}
                    </span>

                    <div className="slider w-full h-1">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress()}
                            onInput={handleProgress}
                            className="level"
                        />
                    </div>
                    <span class="text-xs text-zinc-400">
                        {formatTime(duration())}
                    </span>
                </div>
            </div>

            {/* Right: Volume */}
            <div class="flex items-center gap-4 col-span-3 justify-end">
                <div class="flex flex-col items-center ">
                    <button
                        onClick={() => {
                            setActiveControl(
                                activeControl() === 'playing' ? null : 'playing'
                            );
                            setIsSidebarVisible((prev) => !prev);
                        }}
                        className={`btn bg-transparent p-0 size-fit border-none transition-all duration-100 hover:scale-103 ${
                            activeControl() === 'playing'
                                ? 'text-primary'
                                : 'hover:text-white'
                        }`}
                    >
                        <Playing />
                    </button>
                    <div
                        className={`size-1 transition-all duration-100  mt-1 bg-primary rounded-full ${
                            activeControl() === 'playing'
                                ? 'opacity-100'
                                : 'opacity-0'
                        }`}
                    ></div>
                </div>
                <div class="flex flex-col items-center ">
                    <button
                        onClick={micState.toggleActive}
                        className={`btn bg-transparent p-0 size-fit border-none transition-all duration-100 hover:scale-103 ${
                            micState.active()
                                ? 'text-primary'
                                : 'hover:text-white'
                        }`}
                    >
                        <Mic />
                    </button>
                    <div
                        className={`size-1 transition-all duration-100  mt-1 bg-primary rounded-full ${
                            micState.active() ? 'opacity-100' : 'opacity-0'
                        }`}
                    ></div>
                </div>
                <div class="flex flex-col items-center ">
                    <button
                        onClick={() =>
                            setActiveControl(
                                activeControl() === 'align' ? null : 'align'
                            )
                        }
                        className={`btn bg-transparent p-0 size-fit border-none transition-all duration-100 hover:scale-103 ${
                            activeControl() === 'align'
                                ? 'text-primary'
                                : 'hover:text-white'
                        }`}
                    >
                        <AlignJustify size={20} />
                    </button>
                    <div
                        className={`size-1 transition-all duration-100  mt-1 bg-primary rounded-full ${
                            activeControl() === 'align'
                                ? 'opacity-100'
                                : 'opacity-0'
                        }`}
                    ></div>
                </div>
                <div class="flex flex-col items-center ">
                    <button
                        onClick={() =>
                            setActiveControl(
                                activeControl() === 'device' ? null : 'device'
                            )
                        }
                        className={`btn bg-transparent p-0 size-fit border-none transition-all duration-100 hover:scale-103 ${
                            activeControl() === 'device'
                                ? 'text-primary'
                                : 'hover:text-white'
                        }`}
                    >
                        <Device />
                    </button>
                    <div
                        className={`size-1 transition-all duration-100  mt-1 bg-primary rounded-full ${
                            activeControl() === 'device'
                                ? 'opacity-100'
                                : 'opacity-0'
                        }`}
                    ></div>
                </div>
                <div className="flex flex-col items-center ">
                    <div className="slider h-1">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume()}
                            onInput={handleVolume}
                            className="level max-w-[100px]"
                        />
                        <Volume2 size={20} class="volume" />
                    </div>
                    <div class="size-1 mt-1 opacity-0"></div>
                </div>
                <div className="flex flex-col items-center">
                    <button className="btn  p-0 bg-transparent border-none hover:scale-105 hover:text-white hover:fill-white flex flex-col items-center fill-base-content">
                        <Thumbnail />
                    </button>

                    <div class="size-1 mt-1 opacity-0"></div>
                </div>
                <div class="flex flex-col items-center">
                    <button
                        onClick={toggle}
                        class="btn p-0 bg-transparent border-none hover:scale-110 hover:text-white hover:fill-white flex flex-col items-center fill-base-content"
                    >
                        {isFullscreen() ? (
                            <MinimizeIcon size={16} />
                        ) : (
                            <Maximize size={16} />
                        )}
                    </button>
                    <div class="size-1 mt-1 opacity-0"></div>
                </div>
            </div>

            <audio
                ref={(el) => {
                    audioRef = el;
                    if (el) {
                        el.volume = volume() / 100;
                        el.loop = replayMode() === 2;
                    }
                }}
                src={`${backendUrl}${auth.currentSong().song_url}`}
                preload="auto"
                onTimeUpdate={() => {
                    if (audioRef && audioRef.duration) {
                        setCurrentTime(audioRef.currentTime);
                        setProgress(
                            (audioRef.currentTime / audioRef.duration) * 100
                        );
                    }
                }}
                onLoadedMetadata={() => {
                    if (audioRef) {
                        setDuration(audioRef.duration);
                    }
                }}
                onEnded={handleAudioEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
        </div>
    );
}
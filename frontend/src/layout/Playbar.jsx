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
import {getAllFavoriteSongIdsService, getAllPlaylistIdsService} from "../../services/authService";

export default function Playbar() {
    const [isPlaying, setIsPlaying] = createSignal(false);
    const [progress, setProgress] = createSignal(40);
    const [volume, setVolume] = createSignal(70);
    const { isFullscreen, toggle } = useFullscreen();
    const auth = useAuth();
    let audioRef;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [favoriteSongIds, setFavoriteSongIds] = createSignal([]);
      const [allPlaylistIds, setAllPlaylistIds] = createSignal([]);
    
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
    
      onMount(() => {
        reloadFavoriteList();
        reloadAllPlayList();
      });

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
    };

    const togglePlay = () => {
        if (!audioRef) return;

        if (isPlaying()) {
            audioRef.pause();
            setIsPlaying(false);
        } else {
            audioRef.play();
            setIsPlaying(true);
        }
    };

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const [currentTime, setCurrentTime] = createSignal(0);
    const [duration, setDuration] = createSignal(0);

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
                    position={"dropdown dropdown-end dropdown-bottom top-3 "}
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

                    <button className="btn size-fit bg-transparent border-none hover:scale-105 hover:text-white hover:fill-white flex flex-col items-center fill-base-content">
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

                    <button className="btn bg-transparent hover:scale-105 hover:text-white hover:fill-white border-none flex flex-col items-center fill-base-content">
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
                            max=""
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
                ref={(el) => (audioRef = el)}
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
            />
        </div>
    );
}

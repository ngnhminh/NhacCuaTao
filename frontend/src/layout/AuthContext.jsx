import { createContext, useContext, createSignal, createEffect, onMount } from "solid-js";
import useSocketNotification from '../hooks/useSocketNotification';
import {getAllfollowedArtistIdsService, getUserInformService } from '../../services/authService';

const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [isOpenProfile, setIsOpenProfile] = createSignal(false);
  const [isOpenSearchPage, setIsOpenSearchPage] = createSignal(false);
  const [isSocketOpened, setIsSocketOpened] = createSignal(false);
  const [isArtist, setIsArtist] = createSignal(false);
  const [results, setResults] = createSignal([]);
  const [resultsSong, setResultsSong] = createSignal([]);
  const [currentSong, setCurrentSong] = createSignal(null);
  const [isArtistId, setIsArtistId] = createSignal(null);
  const { connectSocket, followArtist} = useSocketNotification();
  const [followedArtists, setfollowedArtists] = createSignal([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [currentPlaylist, setCurrentPlaylist] = createSignal([]);
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const loadFollowedArtist = async () => {
    try {
      const result = await getAllfollowedArtistIdsService();
      if (result && Array.isArray(result.favArtistList)) {
          const formattedPlaylists = result.favArtistList.map(artist => ({
              id: artist.id,
          }));
          setfollowedArtists(formattedPlaylists);
          // formattedPlaylists.forEach((artist, i) => {
          //   console.log(`Artist ${i}:`, artist.id);
          // });
      }
    } catch (err) {
        console.error("Lỗi khi tải danh sách playlist:", err);
    }
  };
  const getUserInform = async () => {
    try {
      const result = await getUserInformService();
          if(result?.artist) setIsArtistId(result.artist.id);
    } catch (err) {
        console.error("Lỗi khi tải danh sách playlist:", err);
    }
  };

  const initWebSocketOnce = async () => {
    await loadFollowedArtist();
    followedArtists().forEach((artist) => {
      followArtist(artist.id);
    });
  };

  onMount(() => {
    const token = localStorage.getItem('userToken');
      const artistToken = localStorage.getItem('artistToken');
      if (token) {
          setIsLoggedIn(true);
          if(artistToken) setIsArtist(true);
      }
  });

  createEffect(() => {
    if (isLoggedIn()) {
      connectSocket();
      initWebSocketOnce();
      getUserInform().then(() => {
        if (isArtist()) {
          if (isArtistId()) {
            followArtist(isArtistId());
          }
        }
      });
    }
  });

  // Hàm chuyển đến bài hát kế tiếp
  const playNextSong = () => {
      if (currentPlaylist().length === 0) return;
      
      // Tính vị trí bài index tiếp theo
      const nextIndex = (currentIndex() + 1) % currentPlaylist().length;
      setCurrentIndex(nextIndex);
      
      // Cập nhật bài hát hiện tại
      setCurrentSong(currentPlaylist()[nextIndex]);
  };

  // Hàm chuyển đến bài hát trước đó 
  const playPreviousSong = () => {
      if (currentPlaylist().length === 0) return;
      
        // Tính vị trí bài index tiếp theo
      const prevIndex = currentIndex() - 1 < 0 
      ? currentPlaylist().length - 1 
      : currentIndex() - 1;
      setCurrentIndex(prevIndex);
      
      // Cập nhật bài hát hiện tại
      setCurrentSong(currentPlaylist()[prevIndex]);
  };

  // Hàm bắt đầu phát một playlist hoặc album
  const startPlaylist = (songs, startIndex = 0) => {
      if (!songs || songs.length === 0) return;
      
      setCurrentPlaylist(songs);
      setCurrentIndex(startIndex);
      setCurrentSong(songs[startIndex]);
  };

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn, setIsLoggedIn,
        isOpenProfile, setIsOpenProfile,
        isOpenSearchPage, setIsOpenSearchPage,
        results, setResults,
        resultsSong, setResultsSong,
        currentSong, setCurrentSong,
        isSocketOpened, setIsSocketOpened,
        isArtist, setIsArtist,
        currentIndex, setCurrentIndex,
        currentPlaylist, setCurrentPlaylist, 
        playNextSong, playPreviousSong, startPlaylist,
        isArtistId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

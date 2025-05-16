import { createSignal, onMount, onCleanup } from "solid-js";
import { useAuth } from '../layout/AuthContext';
import FavouriteButton from '../components/FavouriteButton';
import { getAllFavoriteSongIdsService, getAllPlaylistIdsService, addToHistoryService } from "../../services/authService";
import { useNavigate } from "@solidjs/router";
import {setShouldReloadHistory} from "../stores/homeStore";

const SearchResultPage = () => {
  const auth = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [favoriteSongIds, setFavoriteSongIds] = createSignal([]);
  const [allPlaylistIds, setAllPlaylistIds] = createSignal([]);

  const [openDropdownSongId, setOpenDropdownSongId] = createSignal(null);
  const [songDropdownRefs, setSongDropdownRefs] = createSignal({});

  const reloadFavoriteList = async () => {
    try {
      const result = await getAllFavoriteSongIdsService();
      setFavoriteSongIds(result.songList);
    } catch (err) {
      console.error('Lỗi khi load danh sách yêu thích:', err);
    }
  };

  const handleClickOutsideSong = (e) => {
      const currentOpenIndex = openDropdownSongId();
      if (currentOpenIndex !== null) {
          const dropdownRef = songDropdownRefs()[currentOpenIndex];
          if (dropdownRef && !dropdownRef.contains(e.target)) {
              setOpenDropdownSongId(null);
          }
      }
  };

  const toggleDropdownSong = (index) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenDropdownSongId(openDropdownSongId() === index ? null : index);
  };

  //Hàm chuyển đổi thời gian
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const reloadAllPlayList = async () => {
    try {
      const result = await getAllPlaylistIdsService();
      setAllPlaylistIds(result.playlistList);
    } catch (err) {
      console.error("Lỗi khi load danh sách playlist:", err);
    }
  }

  onMount(() => {
    reloadFavoriteList();
    reloadAllPlayList();
  });

  
  //Khởi tạo event
  onMount(() => {
      initFlowbite();

      document.addEventListener('click', handleClickOutsideSong);

      onCleanup(() => {
          document.removeEventListener('click', handleClickOutsideSong);
      });
  });
//   const songs = [
//     {
//       id: 1,
//       title: 'Khuôn Mặt Đáng Thương',
//       artist: 'Sơn Tùng M-TP',
//       duration: '4:17',
//       coverUrl: '/api/placeholder/60/60',
//     },
//     {
//       id: 2,
//       title: 'Em Của Ngày Hôm Qua',
//       artist: 'Sơn Tùng M-TP',
//       duration: '3:45',
//       coverUrl: '/api/placeholder/60/60',
//     },
//     {
//       id: 3,
//       title: 'Nắng Ấm Xa Dần',
//       artist: 'Sơn Tùng M-TP',
//       duration: '3:11',
//       coverUrl: '/api/placeholder/60/60',
//     },
//     {
//       id: 4,
//       title: 'Buông Đôi Tay Nhau Ra',
//       artist: 'Sơn Tùng M-TP',
//       duration: '3:47',
//       coverUrl: '/api/placeholder/60/60',
//     },
//   ];

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

  return (
    <div class="flex flex-col h-screen bg-black text-white">
      {/* Navigation Tabs */}
      <div class="p-4 flex gap-2 overflow-x-auto flex-nowrap whitespace-nowrap">
        <button class="bg-white text-black rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Tất cả
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Nghệ sĩ
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Bài hát
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Danh sách phát
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Trang cá nhân
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Podcasts & Shows
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Albums
        </button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium hover:cursor-pointer">
          Genres & Moods
        </button>
      </div>

      {/* Main Content */}
      <div class="flex flex-1 p-4 gap-6">
        {/* Left Side - Top Result */}
        <div class="w-1/3">
          <h2 class="text-2xl font-bold mb-4">Top result</h2>
          {auth.results().slice(0,1).map((artist) => (
            <div
              class="rounded-lg p-1 cursor-pointer transition duration-200 hover:brightness-130"
              onClick={() => navigate(`/artist/${artist.id}`)}
            >
              <div class="bg-zinc-900 rounded-lg p-6 flex flex-col items-center">
                <div class="h-40 w-40 rounded-full overflow-hidden mb-4">
                  <img
                    src={`${backendUrl}${artist.user.avatar_url}`}
                    alt="Artist profile"
                    class="w-full h-full object-cover"
                  />
                </div>
                <h1 class="text-3xl font-bold mb-1">{artist.name}</h1>
                <p class="text-gray-400">Artist</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Songs List */}
        <div class="w-2/3">
          <h2 class="text-2xl font-bold mb-4">Songs</h2>
          <div class="flex flex-col gap-2">
            {auth.resultsSong().slice(0, 4).map((song) => (
              <div
                class="group flex items-center p-2 rounded-md hover:bg-zinc-800 cursor-pointer"
                onClick={() => playSong(song)}
              >
                <div class="w-12 h-12 mr-4">
                  <img
                    src={`${backendUrl}${song.picture_url}`}
                    alt={song.title}
                    class="w-full h-full rounded"
                  />
                </div>
                <div class="flex-grow">
                  <p class="font-medium">{song.song_name}</p>
                  <p class="text-gray-400 text-sm">
                    {song.artist?.artist_name}
                    {song.artists?.map((artist, index) => (
                      <span key={artist.id}>
                        , {artist.artist_name}
                        {index < song.artists.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <FavouriteButton
                    songId={song.id}
                    favoriteSongIds={favoriteSongIds()}
                    reloadFavoriteList={reloadFavoriteList}
                    position={"dropdown dropdown-end dropdown-bottom top-3 "}
                    playlists={allPlaylistIds()}
                    reloadPlaylistList={reloadAllPlayList}
                  />
                  <span class="text-gray-400">
                    {formatTime(song.duration)}
                  </span>
                  <div className="relative">
                    <button 
                      className="text-[#b3b3b3] cursor-pointer py-2 mr-3 opacity-0 group-hover:opacity-100"
                      onClick={() => setOpenDropdownSongId(song.id)}
                      ref={(el) => {
                        const refs = songDropdownRefs();
                        refs[song.id] = el;
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
                    <Show when={openDropdownSongId() === song.id}>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
import { createSignal, onMount, } from "solid-js";
import { useAuth } from '../layout/AuthContext';
import FavouriteButton from '../components/FavouriteButton';
import {getAllFavoriteSongIdsService, getAllPlaylistIdsService} from "../../services/authService";
import { useNavigate } from "@solidjs/router";

const SearchResultPage = () => {
  const auth = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

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

  //Hàm chuyển đổi thời gian
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

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

  const songs = [
    {
      id: 1,
      title: "Khuôn Mặt Đáng Thương",
      artist: "Sơn Tùng M-TP",
      duration: "4:17",
      coverUrl: "/api/placeholder/60/60"
    },
    {
      id: 2,
      title: "Em Của Ngày Hôm Qua",
      artist: "Sơn Tùng M-TP",
      duration: "3:45",
      coverUrl: "/api/placeholder/60/60"
    },
    {
      id: 3,
      title: "Nắng Ấm Xa Dần",
      artist: "Sơn Tùng M-TP",
      duration: "3:11",
      coverUrl: "/api/placeholder/60/60"
    },
    {
      id: 4,
      title: "Buông Đôi Tay Nhau Ra",
      artist: "Sơn Tùng M-TP",
      duration: "3:47",
      coverUrl: "/api/placeholder/60/60"
    }
  ];

  const playSong = (song) => {
    auth.setCurrentSong(song);
  };

  return (
    <div class="flex flex-col h-screen bg-black text-white">
      {/* Navigation Tabs */}
      <div class="p-4 flex gap-2 overflow-x-auto">
        <button class="bg-white text-black rounded-full px-4 py-2 text-sm font-medium">All</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Artists</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Songs</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Playlists</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Profiles</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Podcasts & Shows</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Albums</button>
        <button class="bg-zinc-800 text-white rounded-full px-4 py-2 text-sm font-medium">Genres & Moods</button>
      </div>

      {/* Main Content */}
      <div class="flex flex-1 p-4 gap-6">
        {/* Left Side - Top Result */}
        <div class="w-1/3">
          <h2 class="text-2xl font-bold mb-4">Top result</h2>
          {auth.results().map((artist)=>(
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
                class="flex items-center p-2 rounded-md hover:bg-zinc-800 cursor-pointer" 
                onClick={() => playSong(song)}
              >
                <div class="w-12 h-12 mr-4">
                  <img src={`${backendUrl}${song.picture_url}`} alt={song.title} class="w-full h-full rounded" />
                </div>
                <div class="flex-grow">
                  <p class="font-medium">{song.song_name}</p>
                  <p class="text-gray-400 text-sm">{song.artist.artist_name}
                  {song.artists.map((artist) => (
                    <span key={artist.id}>
                      {artist.artist_name}
                      {index < song.artists.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <FavouriteButton
                    className="text-[#b3b3b3] cursor-pointer py-2 mr-3 opacity-0 group-hover:opacity-100"
                    songId={song.id} favoriteSongIds={favoriteSongIds()} 
                    reloadFavoriteList={reloadFavoriteList} 
                    position={"dropdown dropdown-end dropdown-bottom top-3 "}
                    playlists = {allPlaylistIds()}
                    reloadPlaylistList={reloadAllPlayList}
                  />
                  <span class="text-gray-400">{formatTime(song.duration)}</span>
                  <button class="p-2 rounded-full hover:bg-zinc-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
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
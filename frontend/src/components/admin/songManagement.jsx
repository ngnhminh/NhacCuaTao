import { createSignal, onMount } from "solid-js";
import {deleteSongService} from '../../../services/admin/songManagement';
import {getAllSongOfArtistService} from "../../../services/authService"

export default function ManageSongs() {
  const [songs, setSongs] = createSignal([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  onMount(() => {
      getAllSongsData();
  });

  const getAllSongsData = async () => {
    const result = await getAllSongOfArtistService();
    setSongs(result.songs);
  }

  const deleteSong = async (id) => {
      const result = await deleteSongService(id);
      getAllSongsData();
    };
  

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản Lý Bài Hát</h2>
      <div class="overflow-x-auto bg-white rounded-xl shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hình ảnh</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Tên bài hát</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Nghệ sĩ</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {songs().map(song => (
              <tr key={song.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <img
                    className="w-10 h-10 rounded-[50%] object-cover"
                    src={`${backendUrl}${song.picture_url || "/default.png"}`}
                    alt="Lỗi ảnh"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{song.song_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{song.artist.artist_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => deleteSong(song.id)}
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

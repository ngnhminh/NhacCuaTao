import { createSignal, onMount } from "solid-js";
import {getAllArtistService} from "../../../services/authService"
import {lockUserService, unlockUserService} from '../../../services/admin/userManagement';

export default function ArtistManagement() {

  const [selectedArtist, setSelectedArtist] = createSignal(null);
  const [artists, setArtists] = createSignal([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllArtistsData = async () => {
    const result = await getAllArtistService();
    setArtists(result.artists);
  }

  onMount(() => {
      getAllArtistsData();
  });

  const deleteArtist = (id) => {
    setArtists(artists().filter(artist => artist.id !== id));
  };

  const lockUser = async (id) => {
    const result = await lockUserService(id);
    getAllArtistsData();
  };

  const unlockUser = async (id) => {
    const result = await unlockUserService(id);
    getAllArtistsData();
  };

  const showDetails = (id) => {
    const artist = artists().find(artist => artist.id === id);
    setSelectedArtist(artist);
  };

  const closeModal = () => {
    setSelectedArtist(null);
  };

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản Lý Nghệ Sĩ</h2>
      <div class="overflow-x-auto bg-white rounded-xl shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hình ảnh</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Tên nghệ sĩ</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trạng thái</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {artists().map(artist => (
              <tr key={artist.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <img
                    className="w-10 h-10 rounded-[50%] object-cover"
                    src={`${backendUrl}${artist.user.avatar_url || "/default.png"}`}
                    alt="Lỗi ảnh"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{artist.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{artist.user.email}</td>
                <Show when={artist.user.status === 1} fallback={
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Bị khóa</td>
                }>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Hoạt động</td>
                </Show>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Show when={artist.user.status === 1} fallback={
                    <button
                      onClick={() => unlockUser(artist.user.id)}
                      class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Mở khóa
                    </button>
                  }>
                    <button
                      onClick={() => lockUser(artist.user.id)}
                      class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Khóa
                    </button>
                  </Show>
                  <button
                    onClick={() => showDetails(artist.id)}
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết nghệ sĩ */}
      {selectedArtist() && (
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50 z-40 flex items-center justify-center backdrop-blur-md">
          <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full z-50">
            <h3 class="text-2xl font-semibold text-gray-800">Thông tin chi tiết của {selectedArtist().name}</h3>
            <div class="mt-4">
              <p class="text-sm text-gray-700"><strong>Email:</strong> {selectedArtist().user.email}</p>
              <p class="text-sm text-gray-700"><strong>Số lượng người nghe:</strong> {selectedArtist().followers}</p>
              <p class="text-sm text-gray-700"><strong>Số lượng bài hát:</strong> {selectedArtist().songs_number}</p>
            </div>
            <div class="mt-4 flex space-x-4 justify-end">
              <button
                onClick={closeModal}
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

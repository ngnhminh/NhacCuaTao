import { createSignal } from "solid-js";

export default function ApproveArtists() {
  const [songs, setSongs] = createSignal([
    { id: 1, title: "Bài hát 1", artist: "Nghệ sĩ 1", genre: "Pop", status: "Chờ duyệt" },
    { id: 2, title: "Bài hát 2", artist: "Nghệ sĩ 2", genre: "Rock", status: "Đã duyệt" },
  ]);

  const approveSong = (id) => {
    setSongs(songs().map(song => song.id === id ? { ...song, status: "Đã duyệt" } : song));
  };

  const deleteSong = (id) => {
    setSongs(songs().filter(song => song.id !== id));
  };

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Duyệt Bài Hát</h2>
      <div class="overflow-x-auto bg-white rounded-xl shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Tên bài hát</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Nghệ sĩ</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Thể loại</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trạng thái</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {songs().map(song => (
              <tr key={song.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{song.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{song.artist}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{song.genre}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${song.status === 'Đã duyệt' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{song.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => approveSong(song.id)}
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Duyệt
                  </button>
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
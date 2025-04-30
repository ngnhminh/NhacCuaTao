import { createSignal } from "solid-js";

export default function ManageSongs() {
  const [songs, setSongs] = createSignal([
    { id: 1, title: "Bài hát 1", artist: "Nghệ sĩ 1", genre: "Pop", status: "Đã duyệt" },
  ]);

  const addSong = () => {
    const newSong = { id: Date.now(), title: "Bài hát mới", artist: "Nghệ sĩ mới", genre: "Rock", status: "Chưa duyệt" };
    setSongs([...songs(), newSong]);
  };

  const deleteSong = (id) => {
    setSongs(songs().filter(song => song.id !== id));
  };

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản Lý Bài Hát</h2>
      <button
        onClick={addSong}
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-4"
      >
        Thêm bài hát
      </button>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{song.status}</td>
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

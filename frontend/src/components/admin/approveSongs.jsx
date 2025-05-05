import { createSignal, onMount } from "solid-js";
import { getAllApproveSongsFormsService, approveSongService, deleteApproveSongFormsByIdService} from "../../../services/admin/approveSongsService";

export default function ApproveArtists() {
  const [songs, setSongs] = createSignal([
    { id: 1, title: "Bài hát 1", artist: "Nghệ sĩ 1", genre: "Pop", status: "Chờ duyệt" },
    { id: 2, title: "Bài hát 2", artist: "Nghệ sĩ 2", genre: "Rock", status: "Đã duyệt" },
  ]);

  const [forms, setForms] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const getData = async () => {
      setLoading(true);
      try{
        const result = await getAllApproveSongsFormsService();
        if (result?.list) {
          setForms(result.list); // Gán dữ liệu vào signal
        }
      }catch(err){
          console.error(err);
          alert("Lấy thông tin thất bại");
      }finally {
        setLoading(false);
      }
    }
  
  onMount(() => {
      getData();
    });

  const [selectedSongId, setSelectedSongId] = createSignal(null);

  const approveSong = async (artist, formId) => {
    setLoading(true);
    try{
      const result = await approveSongService(artist, formId);
      if(result){
        alert("Duyệt thành công");
        await getData();
      }
    }catch(err){
        console.error(err);
        alert("Lấy thông tin thất bại");
    }finally {
      setLoading(false);
    }
  };

  const cancelApproval = () => {
    setSelectedSongId(null);
  };

  const deleteApproveForm = async(id) => {
    setLoading(true);
    try{
      const result = await deleteApproveSongFormsByIdService(id);
      if(result){
        alert("Xóa thành công");
        await getData();
      }
    }catch(err){
        console.error(err);
        alert("Lấy thông tin thất bại");
    }finally {
      setLoading(false);
    }
  };

  return (
    <Show when = {!loading()}
    fallback = {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="loading loading-spinner text-white w-14 h-14"></div>
      </div>
    }
    >
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
              <For each={forms()}>
                  {(form) => (
                    <>
                      <tr key={form.id} class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{form.title}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{form.artist.artist_name}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                          {form.status === 1 ? 
                            <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}>Đã duyệt</span>
                            :
                            <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800`}>Chờ duyệt</span>
                          }
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => selectedSongId(form.id)}
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => deleteApproveForm(form.id)}
                            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                      {selectedSongId() === form.id && (
                        <tr class="bg-gray-50">
                          <td colSpan="4" class="px-6 py-4">
                            <div class="space-y-2">
                              <div class="bg-white p-6 rounded-lg shadow-md text-gray-800 space-y-4 max-w-xl mx-auto">
                                <div>
                                  <h2 class="text-xl font-semibold mb-2">Thông tin bài hát</h2>
                                  <div class="space-y-1">
                                    <p><strong>Tên nghệ sĩ:</strong> {form.artist.full_name}</p>
                                    <p><strong>Tên nhạc:</strong> {form.title}</p>
                                    <p><strong>Ngày ra mắt:</strong> {form.release_date}</p>
                                    <p><strong>Thời lượng:</strong> {form.duration} giây</p>
                                    <p><strong>Giới hạn độ tuổi:</strong> {form.is_explicit ? "Có" : "Không"}</p>
                                  </div>
                                </div>

                                <div>
                                  <h3 class="font-semibold">Ảnh sản phẩm</h3>
                                  <img src={form.picture_url} alt="Ảnh bìa" class="w-full max-w-xs rounded shadow" />
                                </div>

                                <div>
                                  <h3 class="font-semibold">Nghe thử</h3>
                                  <audio controls class="w-full">
                                    <source src={form.song_url} type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ phát nhạc.
                                  </audio>
                                </div>

                                <div>
                                  <h3 class="font-semibold">Nghệ sĩ tham gia</h3>
                                  <ul class="list-disc list-inside">
                                    <For each={forms()}>
                                      {(form) => (
                                        <li>{form.artist.artist_name}</li>
                                      )}
                                    </For>
                                  </ul>
                                </div>
                              </div>

                              <div class="space-x-2">
                                {form.status !== 1 && (
                                  <button
                                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    onClick={() => {
                                      approveSong(form.artist, form.id);
                                    }}
                                  >
                                    Xác nhận duyệt
                                  </button>
                                )}
                                <button
                                  onClick={cancelApproval}
                                  class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </For>
              {/* {songs().map(song => (
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
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </Show>

  );
}
import { createSignal, onMount } from "solid-js";
import { getAllApproveArtistFormsService, deleteApproveArtistFormsByIdService, approveArtistService} from "../../../services/admin/approveArtistsService";

export default function ApproveArtists() {
  const [artists, setArtists] = createSignal([
    { id: 1, name: "Nghệ sĩ 1", email: "artist1@example.com", proof: "https://facebook.com/nghesi1", status: "Chờ duyệt" },
    { id: 2, name: "Nghệ sĩ 2", email: "artist2@example.com", proof: "Tên hãng phát hành A", status: "Đã duyệt" },
  ]);

  const [forms, setForms] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const [artistName, setArtistName] = createSignal('');
  const [artistError, setArtistError] = createSignal('');
  
  //Hàm lấy thông tin danh sách duyệt
  const getData = async () => {
    setLoading(true);
    try{
      const result = await getAllApproveArtistFormsService();
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

  const [selectedArtistId, setSelectedArtistId] = createSignal(null);

  const approveArtist = async (user, name, formId) => {
    setLoading(true);
    try{
      const result = await approveArtistService(user, name, formId);
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
    setSelectedArtistId(null);
  };

  const deleteApproveForm = async(id) => {
    setLoading(true);
    try{
      const result = await deleteApproveArtistFormsByIdService(id);
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
        <h2 class="text-3xl font-semibold text-gray-800">Duyệt Nghệ Sĩ</h2>
        <div class="overflow-x-auto bg-white rounded-xl shadow-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Tên nghệ sĩ</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trạng thái</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={forms()}>
                {(form) => (
                  <>
                    <tr key={form.user.id} class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{form.user.full_name}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{form.user.email}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        {form.status === 1 ? 
                          <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}>Đã duyệt</span>
                          :
                          <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800`}>Chờ duyệt</span>
                        }
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => setSelectedArtistId(form.user.id)}
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
                    {selectedArtistId() === form.user.id && (
                      <tr class="bg-gray-50">
                        <td colSpan="4" class="px-6 py-4">
                          <div class="space-y-2">
                            <div class="text-black">
                              <strong>Minh chứng:</strong> {form.link_confirm}
                            </div>
                      
                            {/* Ô nhập tên nghệ sĩ */}
                            {form.status === 1 ? 
                              <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}>Đã duyệt</span>
                              :
                              <div>
                                <label class="block text-sm font-medium text-gray-700">Tên nghệ sĩ</label>
                                <input
                                  type="text"
                                  value={artistName()}
                                  onInput={(e) => setArtistName(e.target.value)}
                                />
                                {artistError() && (
                                  <p class="text-red-600 text-sm mt-1">{artistError()}</p>
                                )}
                              </div>
                            }
                            
                            <div class="space-x-2">
                              {form.status !== 1 && (
                                <button
                                  onClick={() => {
                                    if (!artistName().trim()) {
                                      setArtistError("Tên nghệ sĩ không được để trống");
                                      return;
                                    }
                                    setArtistError('');
                                    approveArtist(form.user, artistName(), form.id);
                                  }}
                                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
              {/* {forms().map(artist => (
                <>
                  <tr key={artist.id} class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{artist.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{artist.email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span class={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${artist.status === 'Đã duyệt' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{artist.status}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => setSelectedArtistId(artist.id)}
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => deleteArtist(artist.id)}
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                  {selectedArtistId() === artist.id && (
                    <tr class="bg-gray-50">
                      <td colSpan="4" class="px-6 py-4">
                        <div class="space-y-2">
                          <div><strong>Minh chứng:</strong> {artist.proof}</div>
                          <div class="space-x-2">
                            <button
                              onClick={() => approveArtist(artist.id)}
                              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Xác nhận duyệt
                            </button>
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
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </Show>
    
  );
}

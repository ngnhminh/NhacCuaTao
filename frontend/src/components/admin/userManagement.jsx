import { createSignal, onMount } from "solid-js";
import {getAllUserService, lockUserService, unlockUserService, deleteUserService} from '../../../services/admin/userManagement';

export default function ApproveArtists() {

  const [users, setUsers] = createSignal([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const getAllUsersData = async () => {
    const result = await getAllUserService();
    setUsers(result.users);
  }

  onMount(() => {
      getAllUsersData();
  });

  const deleteUser = async (id) => {
    const result = await deleteUserService(id);
    getAllUsersData();
  };

  const lockUser = async (id) => {
    const result = await lockUserService(id);
    getAllUsersData();
  };

  const unlockUser = async (id) => {
    const result = await unlockUserService(id);
    getAllUsersData();
  };

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản Lý Người Dùng</h2>
      <div class="overflow-x-auto bg-white rounded-xl shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Avatar</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Họ tên</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trạng thái</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {users().map(user => (
              <tr key={user.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <img
                      className="rounded-[50%]"
                      src={`${backendUrl}${user.avatar_url || "/default.png"}`} alt="Lỗi ảnh"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.full_name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                <Show when={user.status === 1} fallback={
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Bị khóa</td>
                }>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Hoạt động</td>
                </Show>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Show when={user.status === 1} fallback={
                    <button
                      onClick={() => unlockUser(user.id)}
                      class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Mở khóa
                    </button>
                  }>
                    <button
                      onClick={() => lockUser(user.id)}
                      class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Khóa
                    </button>
                  </Show>
                  <button
                    onClick={() => deleteUser(user.id)}
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

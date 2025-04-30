import { createSignal } from "solid-js";

export default function ApproveArtists() {
  const [users, setUsers] = createSignal([
    { id: 1, username: "User1", email: "user1@example.com", role: "Người dùng", status: "Hoạt động" },
    { id: 2, username: "User2", email: "user2@example.com", role: "Admin", status: "Hoạt động" },
  ]);

  const deleteUser = (id) => {
    setUsers(users().filter(user => user.id !== id));
  };

  const lockUser = (id) => {
    setUsers(users().map(user => user.id === id ? { ...user, status: "Đã khóa" } : user));
  };

  return (
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản Lý Người Dùng</h2>
      <div class="overflow-x-auto bg-white rounded-xl shadow-md">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Tên người dùng</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Vai trò</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Trạng thái</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {users().map(user => (
              <tr key={user.id} class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.status}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => lockUser(user.id)}
                    class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Khóa
                  </button>
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

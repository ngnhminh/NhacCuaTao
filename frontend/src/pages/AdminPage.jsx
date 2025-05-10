import { createSignal, Show } from "solid-js";
import ApproveSongs from "../components/admin/approveSongs";
import ApproveArtists from "../components/admin/ApproveArtists";
import UserManagement from "../components/admin/UserManagement";
import SongManagement from "../components/admin/SongManagement";
import ArtistManagement from "../components/admin/ArtistManagement";

export default function AdminPage() {
  const [activeTab, setActiveTab] = createSignal("approve-songs");

  return (
    <div class="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside class="w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white p-6 shadow-lg">
        <h2 class="text-2xl font-bold mb-6 tracking-wide">🎧 Admin Panel</h2>
        <nav class="space-y-3">
          <button
            class={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-600 ${activeTab() === "approve-songs" ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab("approve-songs")}
          >
            Duyệt bài hát
          </button>
          <button
            class={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-600 ${activeTab() === "approve-artists" ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab("approve-artists")}
          >
            Duyệt nghệ sĩ
          </button>
          <button
            class={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-600 ${activeTab() === "users" ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab("users")}
          >
            Quản lý người dùng
          </button>
          <button
            class={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-600 ${activeTab() === "songs" ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab("songs")}
          >
            Quản lý bài hát
          </button>
          <button
            class={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-600 ${activeTab() === "artists" ? 'bg-gray-600' : ''}`}
            onClick={() => setActiveTab("artists")}
          >
            Quản lý nghệ sĩ
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main class="flex-1 p-8 overflow-y-auto">
        <div class="bg-white rounded-xl shadow-xl p-6">
          <Show when={activeTab() === "approve-songs"}><ApproveSongs /></Show>
          <Show when={activeTab() === "approve-artists"}><ApproveArtists /></Show>
          <Show when={activeTab() === "users"}><UserManagement /></Show>
          <Show when={activeTab() === "songs"}><SongManagement /></Show>
          <Show when={activeTab() === "artists"}><ArtistManagement /></Show> {/* Thêm ArtistManagement */}
        </div>
      </main>
    </div>
  );
}

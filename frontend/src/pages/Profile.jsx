import { createSignal, createResource, Show } from "solid-js";
import { uploadAvatarService, getUserInformService, requestArtistApproveService } from "../../services/authService";
import { createGlobalStyles } from "solid-styled-components";

const GlobalStyles = createGlobalStyles`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const Profile = () => {
  const [uploading, setUploading] = createSignal(false);
  let fileInputRef;
  const [user] = createResource(getUserInformService);
  const [showPopup, setShowPopup] = createSignal(false);
  const [facebookLink, setFacebookLink] = createSignal("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    try {
      const res = await uploadAvatarService(formData);
      setUser(prev => ({ ...prev, avatar_url: res.avatarUrl }));
    } catch (err) {
      console.error(err);
      alert("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const sendArtistApproveForm = async() => {
    setUploading(true);
    try{
      const data = await requestArtistApproveService(facebookLink());
      if(data){
        alert("Gửi thành công");
        handlePopupClose();
      }
    }catch(err){
      console.error(err);
    }finally{
      setUploading(false);
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  return (
    <>
      <GlobalStyles />
      <Show when={user()} fallback={<div>Loading...</div>}>
      <div class="w-full bg-gradient-to-b from-gray-800 to-black text-white px-6 py-10">
        <div class="flex items-end gap-6">
          <div class="relative group">
            <img
              src={user().avatar_url || "/default-avatar.jpg"}
              alt="Avatar"
              class="w-32 h-32 rounded-full object-cover shadow-lg cursor-pointer"
              onClick={() => fileInputRef.click()}
            />
            <input
              type="file"
              accept="image/*"
              ref={el => (fileInputRef = el)}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Show when={uploading()}>
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <span class="text-sm">Uploading...</span>
              </div>
            </Show>
          </div>

          <div>
            <h2 class="uppercase text-sm">Profile</h2>
            <h1 class="text-4xl font-bold mt-1">{user().full_name}</h1>
            <p class="text-sm text-gray-300">{user().email}</p>
          </div>
        </div>

        {/* Dòng chữ "Đăng kí nghệ sĩ" */}
        <div class="mt-4 text-center">
          <button
            onClick={handlePopupOpen}
            class="text-sm text-blue-500 underline cursor-pointer"
          >
            Đăng kí nghệ sĩ
          </button>
        </div>

        <div class="mt-10">
          <h3 class="text-2xl font-semibold mb-4">Your Playlists</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition">
              <div class="h-40 bg-gray-700 rounded mb-3"></div>
              <h4 class="font-semibold">Chill Vibes</h4>
              <p class="text-sm text-gray-400">Playlist • 45 songs</p>
            </div>
            <div class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition">
              <div class="h-40 bg-gray-700 rounded mb-3"></div>
              <h4 class="font-semibold">Workout Hits</h4>
              <p class="text-sm text-gray-400">Playlist • 30 songs</p>
            </div>
            {/* Add more playlists here */}
          </div>
        </div>

        {/* Popup đăng kí nghệ sĩ */}
        {showPopup() && (
          <div class="fixed inset-0 bg-gray-400 bg-opacity-10 z-40 flex items-center justify-center backdrop-blur-md transition-all duration-500 ease-in-out animate-fadeIn">
            <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full z-50 transform transition-all duration-500 ease-in-out animate-scaleIn">
              <div class="flex justify-end">
                <button
                  onClick={handlePopupClose}
                  class="text-gray-500 hover:text-gray-700"
                >
                  X
                </button>
              </div>

              {/* Thêm logo vào popup */}
              <div class="text-center mb-4">
                <img
                  src="/path-to-your-logo.jpg" // Đổi đường dẫn logo của bạn
                  alt="Logo"
                  class="w-16 h-16 mx-auto mb-3"
                />
                <h3 class="text-2xl font-semibold mb-4 text-gray-800">Đăng kí nghệ sĩ</h3>
              </div>

              <p class="text-sm text-gray-700 mb-4">
                Hãy đăng kí ngay hôm nay để được quyền đăng những bài hát độc quyền của bạn. Hãy kết nối ngay với chúng tôi.
              </p>

              <div>
                <label class="block text-sm text-gray-700 mb-2">Nhập link Facebook để đợi duyệt nếu chính chủ</label>
                <input
                  type="text"
                  value={facebookLink()}
                  onInput={(e) => setFacebookLink(e.target.value)}
                  class="w-full p-2 rounded-lg bg-gray-100 text-sm text-gray-700"
                  placeholder="Link Facebook"
                />
              </div>

              {/* Nút đăng kí */}
              <div class="flex justify-end mt-4">
                <button
                  onClick={sendArtistApproveForm} // Xử lý đăng kí
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Đăng kí
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Show>
    </>
  );
};

export default Profile;
import { createSignal, Show, createMemo } from "solid-js";
import { Check, CirclePlus, Search } from "lucide-solid";
import {likedSongService, unlikedSongService, addSongInPlaylistService} from "../../services/authService";

export default function FavouriteButton(props) {
  const [isModalOpen, setIsModalOpen] = createSignal(false); // Modal mở chưa
  const [isCancle, setIsCancle] = createSignal(false); // Có muốn hủy yêu thích không

  const isFavourite = createMemo(() => {
    const songIds = Array.isArray(props.favoriteSongIds)
      ? props.favoriteSongIds.map(song => song.song_id)
      : [];
    return songIds.includes(props.songId);
  });
  
  //Hàm lấy playlist và kiểm tra id
  const isSongInPlaylist = (playlist) => {
    const songIds = Array.isArray(playlist.song_ids) ? playlist.song_ids : [];
    console.log("dunghaysao" + songIds.includes(props.songId));
    return songIds.includes(props.songId);
  };
  
  const handlePlusClick = async () => {
    if (!isFavourite()) {
      const result = await likedSongService(props.songId);
      if (result.created) {
        alert("Đã thêm vào bài hát yêu thích");
        props.reloadFavoriteList?.();
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const handleaddPlaylist = async (playlistId, playlist) => {
    if (!isSongInPlaylist(playlist)) {
      const result = await addSongInPlaylistService(props.songId, playlistId);
      if (result.created) {
        alert("Đã thêm vào Playlist của bạn");
        props.reloadPlaylistList?.();
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const confirmUnfavourite = async () => {
    const result = await unlikedSongService(props.songId);
    alert("Đã xóa khỏi danh sách yêu thích");
    props.reloadFavoriteList?.();
    setIsModalOpen(false);
  };

  const handleCheckClick = () => {
    setIsModalOpen(true); // Mở modal khi bấm nút check
    setIsCancle(false); // Reset lại trạng thái hủy
  };

  // const handleConfirm = () => {
  //   if (isCancle()) setIsFavourite(false); // Nếu đã chọn hủy, thì gỡ yêu thích
  //   setIsModalOpen(false);
  // };

  return (
    <div class="card-actions flex items-center">
      {/* Nếu đã thích */}
      <Show
        when={isFavourite()}
        fallback={
          // Nếu chưa thích → hiện nút +
          <button
            onClick={handlePlusClick}
            class={`btn p-0 bg-transparent border-none hover:scale-110 hover:text-white hover:fill-white flex flex-col items-center fill-base-content ${props.className}`}
          >
            <CirclePlus size={18} />
          </button>
        }
      >
        {/* Nếu đã thích → hiện nút Check */}
        <button
          onClick={handleCheckClick}
          class="btn btn-circle size-fit p-[1px] bg-primary border-none text-base-300 flex flex-col items-center fill-base-content mr-3 text-[#b3b3b3]"
        >
          <Check size={16} stroke-width={3} />
        </button>
      </Show>

      {/* Modal dropdown */}
      <Show when={isModalOpen()}>
      {/* dropdown dropdown-top */}
        <details class={props.position} open>
          <summary class="invisible absolute"></summary>

          <div class="dropdown-content menu bg-base-200 flex flex-col gap-3 text-base-content rounded-box w-62 p-0 rounded-md pt-4 shadow-sm">
            <h3 class="text-sm font-semibold text-center">
              Thêm vào danh sách phát
            </h3>
            <div className="px-2">
              <label class="input border-none !outline-none">
                <Search size={16} />
                <input
                  type="search"
                  required
                  placeholder="Tìm danh sách phát"
                  class="w-full text-sm text-white rounded-md px-3 py-2 border-none ring-0 placeholder-gray-400"
                />
              </label>
            </div>

            <div class="border-t pt-2 space-y-2 px-2">
              <button class="w-full cursor-pointer text-left flex items-center space-x-3 hover:bg-base-100 px-3 py-2 rounded-md">
                <span class="text-lg font-medium">＋</span>
                <span>Danh sách phát mới</span>
              </button>

              <div class="w-full text-left flex items-center justify-between hover:bg-base-100 px-3 py-2 rounded-md">
                <div class="flex items-center space-x-3">
                  <div class="bg-gradient-to-br from-purple-500 to-indigo-500 w-8 h-8 rounded-md flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </div>
                  <span>Bài hát đã thích</span>
                </div>

                {/* Check/Hủy trong modal */}
                <Show
                  when={!isCancle()}
                  fallback={
                    <button
                      onClick={() => setIsCancle(false)}
                      class="btn btn-circle size-[18px] bg-transparent border-1 border-base-content"
                    />
                  }
                >
                  <button
                    onClick={() => setIsCancle(true)}
                    class="btn btn-circle size-fit p-[1px] bg-primary border-none text-base-300 flex flex-col items-center fill-base-content"
                  >
                    <Check size={16} stroke-width={3} />
                  </button>
                </Show>
              </div>
              {props.playlists.map((playlist) => (
                <div class="w-full text-left flex items-center justify-between hover:bg-base-100 px-3 py-2 rounded-md">
                  <div class="flex items-center space-x-3">
                    <div class="bg-gradient-to-br from-purple-500 to-indigo-500 w-8 h-8 rounded-md flex items-center justify-center">
                      <svg
                        class="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                    </div>
                    <span>{playlist.playlist_name}</span>
                  </div>

                  {/* Check/Hủy trong modal */}
                  <Show
                    when={isSongInPlaylist(playlist)}
                    fallback={
                      <button
                        onClick={() => handleaddPlaylist(playlist.id, playlist)}
                        class="btn btn-circle size-[18px] bg-transparent border-1 border-base-content"
                      />
                    }
                  >
                    <button
                      onClick={() => setIsModalOpen(false)}
                      class="btn btn-circle size-fit p-[1px] bg-primary border-none text-base-300 flex flex-col items-center fill-base-content"
                    >
                      <Check size={16} stroke-width={3} />
                    </button>
                  </Show>
                </div>
              ))}
            </div>

            <div class="flex justify-end bg-base-100/50 p-1">
              <button
                onClick={() => setIsModalOpen(false)}
                class="btn hover:text-white bg-transparent border-none hover:scale-105"
              >
                Huỷ
              </button>

              <Show when={isCancle()}>
                <button
                  onClick={confirmUnfavourite}
                  class="btn bg-white transition-all duration-200 hover:scale-105 text-base-300 ml-2"
                >
                  Xong
                </button>
              </Show>
            </div>
          </div>
        </details>
      </Show>
    </div>
  );
}
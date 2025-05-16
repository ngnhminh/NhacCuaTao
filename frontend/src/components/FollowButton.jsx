import { createSignal, Show, createMemo } from "solid-js";
import {followArtistService, 
        unfollowArtistService, } from "../../services/authService";

import { setshouldReloadFollowedArtists } from '../stores/artistStore';
import useSocketNotification from '../hooks/useSocketNotification';

export default function FollowButton(props) {
  const {followArtist, unfollowArtist} = useSocketNotification();
  const [hovering, setHovering] = createSignal(false);

  const isFollowed = createMemo(() => {
    const artistIds = Array.isArray(props.followedArtistIds)
      ? props.followedArtistIds.map(artist => artist.id)
      : [];
    return artistIds.includes(props.artistId);
  });

  const handleFollowToggle = async () => {
    if (!isFollowed()) {
      try{
        const result = await followArtistService(props.artistId);
        if (result.created) {
          props.reloadFollowedArtistList?.();
          setshouldReloadFollowedArtists(true);
          followArtist(props.artistId);
        }
      }catch(error){
        console.error("Lỗi" + error)
      }
    } else {
      const result = await unfollowArtistService(props.artistId);
      if (result.removed) {
        props.reloadFollowedArtistList?.();
        setshouldReloadFollowedArtists(true);
        unfollowArtist(props.artistId);
        console.log("Unfollow thành công")
      }
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      class={`px-5 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 transition-all duration-300
        ${isFollowed()
          ? 'bg-transparent border-white text-white hover:border-red-500 hover:text-red-500'
          : 'bg-white text-black hover:bg-gray-200'}
      `}
    >
      {isFollowed() ? (
        <>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
          </svg>
          {hovering() ? "Bỏ theo dõi" : "Đang theo dõi"}
        </>
      ) : (
        <>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Theo dõi
        </>
      )}
    </button>
  );
}

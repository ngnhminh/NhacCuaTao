import Carousel from "../lib/Carousel";
import CarouselForArtist from "../lib/CarouselForArtist";
import { useAuth } from "../../layout/AuthContext";
import {getUserInformService, getAllSongOfArtistService,
        getAllArtistService
        } from "../../../services/authService";
import { createResource, Show, createSignal, onMount} from "solid-js";

export default function MainSection() {
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("userToken");
  const [songs, setSongs] = createSignal([]);
  const [artists, setArtists] = createSignal([]);
  const [data] = createResource(async () => {
    if (!token) return null;
    return await getUserInformService();
  });

  onMount(() => {
      getSongs();
      getArtists();
  });

  const getSongs = async () => {
    try {
      const songList = await getAllSongOfArtistService();
      const sortedSongs = songList.songs.sort((a, b) => b.listen_count - a.listen_count);
      setSongs(sortedSongs);
    } catch (error) {
      console.error('Lỗi lấy bài hát:', error);
    }
  };

  const getArtists = async () => {
    try {
      const artistList = await getAllArtistService();
      const sortedArtists = artistList.artists.sort((a, b) => b.followers - a.followers);
      setArtists(sortedArtists);
    } catch (error) {
      console.error('Lỗi lấy nghệ sĩ:', error);
    }
  };

  // const mixes = [
  //   {
  //     id: 1,
  //     title:
  //       "Nhún nhảy theo những giai điệu mới toanh từ nghệ sĩ bạn theo dõi và đĩa đơn mới dành cho bạn. Cập nhật mỗi thứ Sáu.",
  //     image:
  //       "https://newjams-images.scdn.co/image/ab67647800003f8a/dt/v3/release-radar/ab6761610000e5eb69835ec3f45e1bdd048cccd6/vi",
  //   },
  //   {
  //     id: 2,
  //     title: "Entrainment, Yzalune, MusicoterapiaTeam và nhiều hơn nữa",
  //     image:
  //       "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/daily/1/ab67616d0000b2739ae16e983198b17c4145d30f/vi",
  //   },
  //   {
  //     id: 3,
  //     title: "Sofia Rain, Relaxed Minds, Piano Dreamers và nhiều hơn nữa",
  //     image:
  //       "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/daily/2/ab6761610000e5eb5ae97207eb2ad941814477a2/vi",
  //   },
  //   {
  //     id: 4,
  //     title: "Sơn Tùng M-TP, Mr.Siro, W/N và nhiều hơn nữa",
  //     image:
  //       "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/daily/3/ab6761610000e5eb5a79a6ca8c60e4ec1440be53/vi",
  //   },
  //   {
  //     id: 5,
  //     title: "Sơn Tùng M-TP, Kay Trần, Mr.Siro và nhiều hơn nữa",
  //     image:
  //       "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/daily/4/ab6761610000e5eb5a79a6ca8c60e4ec1440be53/vi",
  //   },
  //   {
  //     id: 6,
  //     title:
  //       "Tuyển tập nhạc mới hằng tuần. Thưởng thức ca khúc mới và ít người nghe dành cho bạn. Cập nhật mỗi thứ Hai.",
  //     image:
  //       "https://newjams-images.scdn.co/image/ab676477000033ad/dt/v3/discover-weekly/1NBwbQeGLDY98hBydmgVSg==/aXZpdml2aXZpdml2aXZpdg==",
  //   },
  // ];
  // const toplist = [
  //   {
  //     id: 1,
  //     artist:
  //       [
  //         { name: 'Sol7' },
  //         { name: 'Đạt G' },
  //         { name: 'Mr.Siro' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/artist/4RGBKkUyyvsim9vdBKCCkc/vi/default",
  //   },
  //   {
  //     id: 2,
  //     artist:
  //       [
  //         { name: 'Đạt G' },
  //         { name: 'Mr.Siro' },
  //         { name: 'Da LAB' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/artist/1LEtM3AleYg1xabW6CRkpi/vi/default",
  //   },
  //   {
  //     id: 3,
  //     artist:
  //       [
  //         { name: 'Ngơ' },
  //         { name: 'Đạt G' },
  //         { name: 'Mr.Siro' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/artist/30eFAXoU2kTjJPf2cq80B8/vi/default",
  //   },
  //   {
  //     id: 4,
  //     artist:
  //       [
  //         { name: 'Đen' },
  //         { name: 'Sol7' },
  //         { name: 'HIEUTHUHAI' },
  //         { name: 'nhiều hơn nữa' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/indie/1LEtM3AleYg1xabW6CRkpi/vi/default",
  //   },
  //   {
  //     id: 5,
  //     artist:
  //       [
  //         { name: 'Đen' },
  //         { name: 'MIN' },
  //         { name: 'Ngơ' },
  //         { name: 'nhiều hơn nữa' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/chill/1LEtM3AleYg1xabW6CRkpi/vi/default",
  //   },
  //   {
  //     id: 6,
  //     artist:
  //       [
  //         { name: 'MIN' },
  //         { name: 'nhiều hơn nữa' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/reggae/0IdAjS2LRieBR3gzoazdAw/vi/default",
  //   },
  //   {
  //     id: 7,
  //     artist:
  //       [
  //         { name: 'Ngơ' },
  //         { name: 'HIEUTHUHAI' },
  //         { name: 'Đạt G' },
  //         { name: 'nhiều hơn nữa' },
  //       ],
  //     image:
  //       "https://seed-mix-image.spotifycdn.com/v6/img/hip_hop/4RGBKkUyyvsim9vdBKCCkc/vi/default",
  //   },
  // ];

  return (
    <Show
      when={!data.loading}
      fallback={
        <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div class="loading loading-spinner text-white w-14 h-14"></div>
        </div>
      }
    >
      <div class="text-white p-6 font-sans space-y-6">
        <Show when={isLoggedIn()}
          fallback={
              <>
                {/* {Section 1} */}
                <div className="flex justify-between items-center">
                  <h2 class="text-2xl font-bold">Nhạc thịnh hành</h2>
                  <a href="#" className="hover:underline text-base-content font-medium">
                    <span>Hiện tất cả</span>
                  </a>
                </div>
                <Carousel items={songs()} itemWidth={200} />

                {/* {Section 2} */}
                <div className="flex justify-between items-center">
                  <h2 class="text-2xl font-bold">Nhạc sĩ hàng đầu</h2>
                  <a href="#" className="hover:underline text-base-content font-medium">
                    <span>Hiện tất cả</span>
                  </a>
                </div>
                <CarouselForArtist items={artists()} itemWidth={200} />

                {/* {Section 3} */}
                {/* <div className="flex justify-between items-center">
                  <h2 class="text-2xl font-bold">Top Album hoặc Single</h2>
                  <a href="#" className="hover:underline text-base-content font-medium">
                    <span>Hiện tất cả</span>
                  </a>
                </div>
                <Carousel items={toplist} itemWidth={200} /> */}
              </>
            }
          >
            <>
            <div className="flex justify-between items-center">
              <h2 class="text-2xl font-bold">Dành Cho {data().user.full_name}</h2>
              <a href="#" className="hover:underline text-base-content font-medium">
                <span>Hiện tất cả</span>
              </a>
            </div>
            <Carousel items={songs()} itemWidth={200} />

            <div className="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Tuyển tập hàng đầu</h2>
                <a href="#" className="hover:underline text-base-content font-medium">
                  <span>Hiện tất cả</span>
                </a>
              </div>
              <CarouselForArtist items={artists()} itemWidth={200} />
          </>
        </Show>
      </div>
    </Show>
    
  );
}

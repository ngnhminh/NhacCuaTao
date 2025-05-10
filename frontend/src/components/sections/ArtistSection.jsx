import { useAuth } from '../../layout/AuthContext';
import { getArtistInformService, getAllSongOfArtistByIdService } from '../../../services/authService';
import { createResource, Show, onMount } from 'solid-js';
import AlbumCard from '../AlbumCard';
import { createSignal } from 'solid-js';
import { useParams } from "@solidjs/router";
import {getAllFavoriteSongIdsService, getAllPlaylistIdsService} from "../../../services/authService";
import FavouriteButton from '../../components/FavouriteButton';

export default function ArtistSection() {
    const [showAll, setShowAll] = createSignal(false);
    const [showModal, setShowModal] = createSignal(false);
    const visibleSongs = () => (showAll() ? songs() : songs().slice(0, 5));
    const params = useParams();
    const id = params.id;
    const [loading, setLoading] = createSignal(true);
    const [artist, setArtist] = createSignal(true);
    const [songs, setSongs] = createSignal([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const auth = useAuth();

    const [favoriteSongIds, setFavoriteSongIds] = createSignal([]);
    const [allPlaylistIds, setAllPlaylistIds] = createSignal([]);

    onMount(() => {
        getData(id);
        getSongs(id);
        reloadFavoriteList();
        reloadAllPlayList();
    });

    //Hàm chuyển đổi thời gian
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const reloadFavoriteList = async () => {
        try{
            const result = await getAllFavoriteSongIdsService();
            setFavoriteSongIds(result.songList);
        }catch (err) {
        console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }

    const reloadAllPlayList = async () => {
        try{
            const result = await getAllPlaylistIdsService();
            setAllPlaylistIds(result.playlistList);
        }catch (err) {
        console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }

    const getData = async (id) => {
        setLoading(true);
        try{
            const result = await getArtistInformService(id);
            // console.log(result)
            setArtist(result.artist)
        }catch(err){
            console.error(err);
            alert("Lấy thông tin thất bại");
        }finally {
            setLoading(false);
        }
    }
    
    // const songs = [
    //     {
    //         id: 1,
    //         img: 'https://i.scdn.co/image/ab67616d00001e02bb9722d7560ee2545864029a',
    //         title: 'Cơn mưa tháng 5 - Special Edition 2020',
    //         listens: '1186222',
    //         duration: '4:42',
    //     },
    //     {
    //         id: 2,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0200953ab29a88f444d582c9c7',
    //         title: 'Đường đến vinh quang',
    //         listens: '113194',
    //         duration: '5:32',
    //     },
    //     {
    //         id: 3,
    //         img: 'https://i.scdn.co/image/ab67616d00001e020ecd1c9f2bd6b3e99be97b79',
    //         title: 'Nơi đó có chúng ta thuộc về nhau',
    //         listens: '151804',
    //         duration: '3:53',
    //     },
    //     {
    //         id: 4,
    //         img: 'https://i.scdn.co/image/ab67616d00001e020c6211ec7b9c2bb396ef10cb',
    //         title: 'Bông hồng xanh',
    //         listens: '191089',
    //         duration: '5:31',
    //     },
    //     {
    //         id: 5,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Tháng 10',
    //         listens: '605130',
    //         duration: '4:28',
    //     },
    //     {
    //         id: 6,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Mùa đông ở lại',
    //         listens: '413958',
    //         duration: '4:40',
    //     },
    //     {
    //         id: 7,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Con đường không tên',
    //         listens: '302866',
    //         duration: '4:49',
    //     },
    //     {
    //         id: 8,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Bình yên',
    //         listens: '315081',
    //         duration: '6:00',
    //     },
    //     {
    //         id: 9,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Mùa hè đi qua',
    //         listens: '138284',
    //         duration: '4:00',
    //     },
    //     {
    //         id: 10,
    //         img: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
    //         title: 'Tháng 12',
    //         listens: '35302',
    //         duration: '4:35',
    //     },
    // ];

    const getSongs = async (id) => {
        setLoading(true);
        try {
            const result = await getAllSongOfArtistByIdService(id);
            setSongs(result.songs)
            console.log(result.songs)
        } catch (error) {
            console.error("Lỗi không lấy được danh sách bài hát của nghệ sĩ");
            return [];
        }finally{
            setLoading(false);
        }
    }
    
    const playSong = (song) => {
        auth.setCurrentSong(song);
      };

    const albums = [
        {
            imgSrc: 'https://i.scdn.co/image/ab67616d00001e0264fff4911371aa61b1672b10',
            title: 'Con đường không tên',
            year: '2020',
        },
        {
            imgSrc: 'https://i.scdn.co/image/ab67616d00001e020c6211ec7b9c2bb396ef10cb',
            title: 'Cân bằng',
            year: '2023',
        },
        {
            imgSrc: 'https://i.scdn.co/image/ab67616d00001e02bb9722d7560ee2545864029a',
            title: 'Cơn mưa tháng 5 (Special edition 2020)',
            year: '2020',
        },
        {
            imgSrc: 'https://i.scdn.co/image/ab67616d00001e0200953ab29a88f444d582c9c7',
            title: 'Đường đến đỉnh vinh quang',
            year: '2013',
        },
        {
            imgSrc: 'https://i.scdn.co/image/ab67616d00001e020ecd1c9f2bd6b3e99be97b79',
            title: 'Nơi đó có chúng ta thuộc về nhau',
            year: '2023',
        },
    ];

    return (
        <Show when = {!loading()}
            fallback = {
            <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div class="loading loading-spinner text-white w-14 h-14"></div>
            </div>
            }
        >
            <div class="text-white pt-7 pb-4">
                <Show when={auth.isLoggedIn()}>
                    <div className="flex px-6 pb-6 items-center">
                        <button className="mr-4 cursor-pointer hover:scale-[1.02] transition">
                            <img
                                className="rounded-[50%] w-[144px] h-[144px] shadow-[0_4px_60px_rgba(0,0,0,0.5)]"
                                src={`${backendUrl}${artist().user.avatar_url}`}
                            />
                        </button>
                        <div className="flex flex-1 flex-col flex-nowrap justify-end">
                            <span className="flex items-center gap-2">
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 fill-current text-[#4cb3ff]"
                                >
                                    <path d="M10.814.5a1.658 1.658 0 0 1 2.372 0l2.512 2.572 3.595-.043a1.658 1.658 0 0 1 1.678 1.678l-.043 3.595 2.572 2.512c.667.65.667 1.722 0 2.372l-2.572 2.512.043 3.595a1.658 1.658 0 0 1-1.678 1.678l-3.595-.043-2.512 2.572a1.658 1.658 0 0 1-2.372 0l-2.512-2.572-3.595.043a1.658 1.658 0 0 1-1.678-1.678l.043-3.595L.5 13.186a1.658 1.658 0 0 1 0-2.372l2.572-2.512-.043-3.595a1.658 1.658 0 0 1 1.678-1.678l3.595.043L10.814.5zm6.584 9.12a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"></path>
                                </svg>
                                <span className="text-sm font-normal flex items-center">
                                    Nghệ sĩ được xác minh
                                </span>
                            </span>
                            <span className="py-3">
                                <h1 className="text-5xl font-extrabold capitalize">
                                    {artist().name}
                                </h1>
                            </span>
                            <div className="flex flex-wrap items-center mt-2 text-[#ffffffb3]">
                                <div className="mt-1 text-white">
                                    19.886 người nghe hằng tháng
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start p-6">
                        <div className="flex flex-row items-center">
                            <div className="shrink mr-4">
                                <button className="self-center rounded-[9999px] cursor-pointer inline-block text-center align-middle will-change-transform hover:scale-[1.04]">
                                    <span className="h-14 w-14 items-center bg-[#1ed760] rounded-[9999px] text-black flex justify-center hover:bg-[#3be477]">
                                        <span aria-hidden="true">
                                            <svg
                                                role="img"
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                class="w-6 h-6 fill-current text-black"
                                            >
                                                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                                            </svg>
                                        </span>
                                    </span>
                                </button>
                            </div>
                            <button className="py-1 px-4 mr-6 font-bold text-sm rounded-[9999px] cursor-pointer text-center border border-[#818181] hover:scale-[1.04]">
                                Theo dõi
                            </button>
                            <button className="mr-4 cursor-pointer py-3 text-[#b3b3b3] hover:text-white hover:scale-[1.04]">
                                <span aria-hidden="true">
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        className="w-8 h-8 fill-current"
                                    >
                                        <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="px-6 mb-10">
                        <div className="text-white text-2xl font-bold text-balance mb-4">
                            Phổ biến
                        </div>

                        <For each={visibleSongs()}>
                            {(song) => (
                                <div 
                                    className="h-14 pl-6 mb-4 hover:bg-[#ffffff1a] cursor-pointer rounded-sm group"
                                    onClick={() => playSong(song)}
                                >
                                    <div className="group grid grid-cols-[minmax(200px,_1fr)_1fr_minmax(120px,_160px)] items-center h-14 gap-4">
                                        {/* Bên trái: Số và tên bài hát */}
                                        <div className="flex items-center gap-4">
                                            {/* Số / nút play */}
                                            <div className="flex justify-center text-[#b3b3b3] w-4 text-right">
                                                <button className="text-white hidden group-hover:block">
                                                    <svg
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        className="w-4 h-4 fill-current"
                                                    >
                                                        <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Ảnh và tên bài hát */}
                                            <div className="flex items-center gap-4">
                                                <img
                                                    className="w-10 h-10 rounded-sm"
                                                    src={`${backendUrl}${song.picture_url}`}
                                                />
                                                <a
                                                    href="#"
                                                    className="text-base line-clamp-1 capitalize hover:underline text-white"
                                                >
                                                    {song.song_name}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Giữa: Lượt nghe */}
                                        <div className="text-white text-sm text-center">
                                            {Number(song.listion_count).toLocaleString(
                                                'vi-VN'
                                            )}
                                        </div>

                                        {/* Bên phải: icon + thời lượng */}
                                        <div className="flex items-center justify-end">
                                            <FavouriteButton
                                                className="text-[#b3b3b3] cursor-pointer py-2 mr-3 opacity-0 group-hover:opacity-100"
                                                songId={song.id} favoriteSongIds={favoriteSongIds()} 
                                                reloadFavoriteList={reloadFavoriteList} 
                                                position={"dropdown dropdown-end dropdown-bottom top-3 "}
                                                playlists = {allPlaylistIds()}
                                                reloadPlaylistList={reloadAllPlayList}
                                            />
                                            <div className="text-[#b3b3b3] text-sm font-normal mr-3">
                                                {formatTime(song.duration)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </For>
                        {songs().length > 5 && (
                            <button
                                className="p-4 text-[#ffffffb3] font-bold text-sm cursor-pointer hover:text-white"
                                onClick={() => setShowAll(!showAll())}
                            >
                                {showAll() ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                    </div>

                    <div className="px-9">
                        <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                        <div>
                            <button
                                className="bg-[#282828] cursor-pointer rounded-[8px] hover:scale-[1.01] transition-all ease-in-out"
                                onClick={() => setShowModal(true)}
                            >
                                <div className="max-w-[672px] p-10 text-left">
                                    <div className="w-[204px] h-[204px] mb-6">
                                        <img
                                            className="rounded-[50%] object-cover"
                                            src={`${backendUrl}${artist().user.avatar_url}`}
                                        />
                                    </div>
                                    <div className="font-bold">
                                        19.806 người nghe hằng tháng
                                    </div>
                                    <div className="mt-2 text-[1rem] line-clamp-3">
                                        {artist().description}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div
                        className={` ${
                            showModal() ? 'block' : 'hidden'
                        } fixed inset-0 bg-black/70 flex items-center justify-center z-99`}
                    >
                        <dialog className="flex bg-[#121212] rounded-[8px] w-[768px] flex-col text-[#b3b3b3] relative max-w-[calc(100vw-32px)] max-h-[calc(100vw-32px)]">
                            <button
                                className="absolute bg-[#000000b3] rounded-[50%] h-8 w-8 flex justify-center items-center right-4 top-4 cursor-pointer hover:bg-[#121212] hover:text-white"
                                onClick={() => setShowModal(false)}
                            >
                                <svg
                                    role="img"
                                    viewBox="0 0 16 16"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z"></path>
                                </svg>
                            </button>
                            <div className="p-10">
                                <div className="flex flex-row">
                                    <div className="flex flex-col mb-8">
                                        <div className="mr-10 mb-10 leading-[1]">
                                            <div className="text-white font-bold text-balance text-[2rem]">
                                                {Number(23596).toLocaleString(
                                                    'vi-VN'
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                Người theo dõi
                                            </div>
                                        </div>
                                        <div className="mr-10 mb-10 leading-[1]">
                                            <div className="text-white font-bold text-balance text-[2rem]">
                                                {Number(19806).toLocaleString(
                                                    'vi-VN'
                                                )}
                                            </div>
                                            <div className="text-sm w-[110px]">
                                                Người nghe hàng tháng
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[1rem] mb-4">
                                            - Được thành lập ngày 26/3/1995 từ phong
                                            trào ca nhạc sinh viên từ Trường ĐH Xây
                                            dựng với các thành viên sáng lập Trần
                                            Lập - Trần Tuấn Hùng - Nguyễn Hoàng
                                            (trong đó Tuấn Hùng và Nguyễn Hoàng là
                                            sinh viên Đại học Xây dựng, Trần Lập học
                                            tại cao đẳng VH Nghệ thuật Hà nội). - 25
                                            năm hoạt động, Bức Tường đã viết nên một
                                            câu chuyện kỳ diệu, bắt đầu từ những
                                            sinh viên Đại học với ước mơ nhỏ nhoi là
                                            mong có được những cây đàn của riêng
                                            mình, để rồi trở thành những nghệ sĩ
                                            hàng đầu trong nền âm nhạc Việt Nam. Đại
                                            diện cho VN tham dự các hoạt động văn
                                            hoá quốc tế, là một trong những người
                                            tiên phong và đem nhạc Rock tới với
                                            nhiều thế hệ khán giả trên cả nước. -
                                            Vượt qua khỏi những tác phẩm âm nhạc,
                                            Bức Tường trở thành biểu tượng của những
                                            giá trị tốt đẹp, là hình ảnh mẫu mực của
                                            một thế hệ thanh niên VN văn minh, dám
                                            mơ ước và thực hiện. - Bức Tường cũng là
                                            một trong số ít những Ban nhạc Rock của
                                            Việt Nam đã giành được 2 đề cử và 1 giải
                                            Cống hiến. - Trưởng nhóm của ban nhạc,
                                            ca sĩ Trần Lập, đã qua đời vào ngày
                                            17/3/2016 do bệnh Ung thư trực tràng. -
                                            3/2019, ra mắt Single Những ngày tháng
                                            tuyệt vời, một sáng tác của Guitarist
                                            Trần Tuấn Hùng. - 3/2020, phát hành tác
                                            phẩm XXV nhân kỷ niệm 25 năm thành lập.
                                            - 11/2020, phát hành album Vol.6 "Con
                                            Đường Không Tên"
                                        </p>
                                        <div className="mt-8 flex items-center">
                                            <img
                                                className="w-8 h-8 rounded-[50%] mr-2"
                                                src="https://i.scdn.co/image/ab6761610000101ff8d2c15a9b3c1a049ec4286c"
                                            />
                                            <div className="text-sm">
                                                Đăng bởi Bức Tường
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </dialog>
                    </div>

                    <div className="px-6">
                        <section className="mt-12 flex max-w-full max-h-full flex-col">
                            <div className="flex justify-between items-center mb-2 px-3">
                                <div className="font-bold cursor-pointer hover:underline">
                                    <a className="text-2xl">
                                        Album khác của Bức Tường
                                    </a>
                                </div>
                                <div className="text-[#b3b3b3] font-bold cursor-pointer hover:underline">
                                    <a className="text-sm">Hiện tất cả</a>
                                </div>
                            </div>
                            <div className="grid auto-rows-auto grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                {albums.map((album, index) => (
                                    <AlbumCard key={index} {...album} />
                                ))}
                            </div>
                        </section>
                    </div>
                </Show>
            </div>
        </Show>
    );
}

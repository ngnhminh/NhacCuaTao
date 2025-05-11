import { createSignal, createResource, Show, createEffect } from 'solid-js';
import {
    uploadAvatarService,
    getUserInformService,
    requestArtistApproveService,
    updateArtistInformService,
    requestSongApproveService,
    getAllArtistService,
    getAllSongOfArtistByIdService,
    addNewAlbumService,
    getAllArtistAlbumService
} from '../../services/authService';
import { createGlobalStyles } from 'solid-styled-components';
import DatePicker from '@rnwonder/solid-date-picker';
import '@rnwonder/solid-date-picker/dist/style.css';
import Footer from '../layout/Footer';
import FollowArtists from '../components/sections/FollowArtists';
import SidePart from '../components/SidePart';
import PanelContainer from '../components/PanelContainer';
import { useNavigate } from "@solidjs/router";

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
    const followArtists = [
        {
            id: 1,
            img: 'https://i.scdn.co/image/ab6761610000101ff8d2c15a9b3c1a049ec4286c',
            name: 'Bức tường',
            title: 'Nghệ sĩ',
        },
        {
            id: 2,
            img: 'https://i.scdn.co/image/ab6761610000101f91d2d39877c13427a2651af5',
            name: 'Đen',
            title: 'Nghệ sĩ',
        },
        {
            id: 3,
            img: 'https://i.scdn.co/image/ab67616d00001e029dd14ae4c7377d19d33a58d5',
            name: 'Trịnh Công Sơn',
            title: 'Nhạc sĩ',
        },
        {
            id: 4,
            img: 'https://i.scdn.co/image/ab67616d00001e024cde8ea04aa845a87d08c890',
            name: 'Văn Cao',
            title: 'Nhạc sĩ',
        },
        {
            id: 5,
            img: 'https://i.scdn.co/image/ab67616100005174f1310d077ecfed399b5c7ca9',
            name: 'Jorn Lande',
            title: 'Nghệ sĩ',
        },
    ];
    const navigate = useNavigate();
    const [uploading, setUploading] = createSignal(false);
    let fileInputRef;
    const [data, { refetch }] = createResource(getUserInformService);

    const [showPopup, setShowPopup] = createSignal(false);
    const [showDetail, setShowDetail] = createSignal(false);
    const [showAddMusic, setShowAddMusic] = createSignal(false);
    const [showAddAlbum, setShowAddAlbum] = createSignal(false);
    const [facebookLink, setFacebookLink] = createSignal('');
    const [editField, setEditField] = createSignal(null);
    const [previewImage, setPreviewImage] = createSignal(null);
    const [searchResults, setSearchResults] = createSignal([]);
    const [allAlbum, setAllAlbum] = createSignal([]);
    const [tempData, setTempData] = createSignal({
        full_name: '',
        description: '',
        country: '',
    });
    
    const [newSong, setNewSong] = createSignal({
        title: '',
        releaseDate: new Date(),
        ageRestricted: false,
        musicFile: null,
        cover: null,
        featuredArtists: [], //Nghệ sĩ cover cùng
    });

    const [newAlbum, setNewAlbum] = createSignal({
        album_name: '',
        releaseDate: new Date(),
        album_picture: null,
        songs: [], 
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Khi data load xong thì cập nhật formData
    createEffect(() => {
        const d = data();
        if (d?.user && d?.artist) {
            setTempData({
                full_name: data().user.full_name,
                description: data().artist?.description || '',
                country: data().artist?.country || '',
            });
        }
        // console.log("thông tin", d)
        if(d?.artist?.id){
            reloadAllAlbum(d.artist.id)
        }
    });

    const reloadAllAlbum = async (artistId) => {
        try{
            const result = await getAllArtistAlbumService(artistId);
            console.log("thông tin hàm allALbum " + result)
            setAllAlbum(result.albumList);
        }catch (err) {
        console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }

    function handleChange(field, value) {
        setTempData((prev) => ({ ...prev, [field]: value }));
    }

    const cancelEdit = () => {
        setTempData({
            full_name: data().user.full_name,
            description: data().artist?.description || '',
            country: data().artist?.country || '',
        });
        setEditField(null);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);
        setUploading(true);
        try {
            const res = await uploadAvatarService(formData);
            await refetch();
        } catch (err) {
            console.error(err);
            alert('Upload thất bại');
        } finally {
            setUploading(false);
        }
    };

    const sendArtistApproveForm = async () => {
        setUploading(true);
        try {
            const data = await requestArtistApproveService(facebookLink());
            if (data) {
                alert('Gửi thành công');
                handlePopupClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handlePopupClose = () => {
        setShowPopup(false);
        setShowAddMusic(false);
        setShowAddAlbum(false);
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
    };

    const saveChanges = async () => {
        await updateArtistInformService(tempData());
        console.log('Saved:', tempData());
        alert('Lưu thông tin thành công');
        refetch();
        setEditField(null);
    };

    //Gửi thông tin tạo nhạc
    const handleAddMusicSubmit = async () => {
        const song = newSong();
        console.log(newSong().releaseDate);
        if (!(song.releaseDate instanceof Date)) {
            alert('Vui lòng chọn ngày phát hành hợp lệ');
            return;
        }

        const formData = new FormData();
        console.log('tên: ' + song.title);
        formData.append('title', song.title);
        formData.append(
            'releaseDate',
            song.releaseDate.toISOString().split('T')[0]
        );
        console.log(song.releaseDate.toISOString().split('T')[0]);
        formData.append('ageRestricted', song.ageRestricted ? '1' : '0');
        formData.append('musicFile', song.musicFile);
        formData.append('cover', song.cover);

        formData.append(
            'featuredArtists',
            JSON.stringify(song.featuredArtists)
        );
        console.log(formData.get('title'));
        console.log('data trước khi lên' + formData);

        await requestSongApproveService(formData);
        alert('Đã gửi thông tin bài hát');
        handlePopupClose();
    };

    //Gửi thông tin tạo album
     const handleAddAlbumSubmit = async () => {
        const album = newAlbum();
        if (!(album.releaseDate instanceof Date)) {
            alert('Vui lòng chọn ngày phát hành hợp lệ');
            return;
        }
        const formData = new FormData();
        formData.append('album_name', album.album_name);
        formData.append(
            'releaseDate',
            album.releaseDate.toISOString().split('T')[0]
        );

        formData.append('album_picture', album.album_picture);

        formData.append(
            'songs',
            JSON.stringify(album.songs)
        );
        await addNewAlbumService(formData);
        alert('Tạo album thành công');
        handlePopupClose();
    }

    const handleOpenAlbum = (id) => {
        navigate(`/album/${id}`)
    }

    return (
        <>
            <GlobalStyles />
            <Show when={data()} fallback={<div>Loading...</div>}>
                <div className="flex h-[calc(100vh-64px-72px)] gap-3 px-3 pb-3 pt-1 overflow-hidden w-full bg-gradient-to-b from-[#121212] to-[#121212] text-white">
                    <SidePart />
                    <div className="flex-1 overflow-auto rounded-lg bg-[#121212]">
                        <div
                            className="h-[380px] bg-gradient-to-b from-[#1e1e1e] via-[#121212] to-black p-10 rounded-b-2xl shadow-inner"
                            onClick={() => setShowDetail(true)}
                        >
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8 pt-12">
                                {/* Avatar + Upload */}
                                <div className="relative group cursor-pointer">
                                    <img
                                        src={
                                            `${backendUrl}${data().user.avatar_url}` || '/default-avatar.jpg'
                                        }
                                        alt="Avatar"
                                        className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full object-cover border-4 border-[#1e1e1e] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-105"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.click();
                                        }}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={(el) => (fileInputRef = el)}
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                    <Show when={uploading()}>
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full backdrop-blur-md">
                                            <span className="text-white text-sm animate-pulse">Đang tải lên...</span>
                                        </div>
                                    </Show>
                                </div>

                                {/* Thông tin user */}
                                <div className="text-white flex flex-col items-center sm:items-start gap-2">
                                    <span className="text-xs tracking-widest uppercase text-[#b3b3b3] font-semibold">Hồ sơ</span>
                                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold leading-tight drop-shadow-xl text-white">{data().user.full_name}</h1>
                                    <p className="text-sm sm:text-base text-[#b3b3b3] mt-2">
                                        11 đang theo dõi •{' '}
                                        {data()?.artist ? (
                                            <span className="text-white font-medium">{data().artist.followers} người hâm mộ</span>
                                        ) : (
                                            '0 bài hát'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>


                        <Show when={showDetail()}>
                            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                                <div className="bg-[#181818] rounded-2xl w-[524px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] overflow-auto text-[#b3b3b3] shadow-2xl animate-scaleIn">
                                    {/* Header */}
                                    <div className="flex justify-between items-center p-6 border-b border-[#2a2a2a]">
                                        <h3 className="text-2xl font-bold text-white">Chi Tiết Thông Tin</h3>
                                        <button
                                            className="rounded-full h-8 w-8 flex justify-center items-center hover:bg-[#2a2a2a] transition-colors"
                                            onClick={() => setShowDetail(false)}
                                        >
                                            <svg role="img" viewBox="0 0 16 16" className="h-4 w-4 fill-white">
                                                <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 space-y-6">
                                        {/* Avatar và Full Name */}
                                        <div className="flex items-center gap-6">
                                            <img
                                                className="w-24 h-24 rounded-full object-cover border-2 border-[#333] shadow-md"
                                                src={`${backendUrl}${data()?.user?.avatar_url}` || '/default-avatar.jpg'}
                                            />
                                            <div className="flex-1 text-white">
                                                <Show when={editField() === 'full_name'} fallback={
                                                    <>
                                                        <p><span className="font-semibold">Tên: </span>{data()?.user.full_name}</p>
                                                        <button
                                                            onClick={() => setEditField('full_name')}
                                                            className="text-sm text-blue-500 hover:underline mt-1"
                                                        >
                                                            ✏️ Chỉnh sửa
                                                        </button>
                                                    </>
                                                }>
                                                    <input
                                                        className="border border-[#444] bg-[#2a2a2a] text-white rounded px-3 py-2 w-full"
                                                        value={tempData().full_name}
                                                        onInput={(e) => handleChange('full_name', e.target.value)}
                                                    />
                                                </Show>
                                            </div>
                                        </div>

                                        {/* Thông tin nghệ sĩ nếu có */}
                                        {data()?.artist && (
                                            <>
                                                <div className="text-sm">
                                                    <span className="text-[#888]">Nghệ danh:</span>{' '}
                                                    <span className="text-white font-medium">{data().artist.artist_name}</span>
                                                </div>

                                                {/* Description */}
                                                <div>
                                                    <Show when={editField() === 'description'} fallback={
                                                        <div className="flex justify-between items-start">
                                                            <p><span className="font-semibold">Mô tả:</span> {data().artist.description}</p>
                                                            <button
                                                                onClick={() => setEditField('description')}
                                                                className="text-sm text-blue-500 hover:underline"
                                                            >
                                                                ✏️
                                                            </button>
                                                        </div>
                                                    }>
                                                        <textarea
                                                            rows="3"
                                                            className="w-full bg-[#2a2a2a] text-white border border-[#444] rounded px-3 py-2"
                                                            value={tempData().description}
                                                            onInput={(e) => handleChange('description', e.target.value)}
                                                        />
                                                    </Show>
                                                </div>

                                                {/* Country */}
                                                <div>
                                                    <Show when={editField() === 'country'} fallback={
                                                        <div className="flex justify-between items-center">
                                                            <p><span className="font-semibold">Quốc gia:</span> {data().artist.country}</p>
                                                            <button
                                                                onClick={() => setEditField('country')}
                                                                className="text-sm text-blue-500 hover:underline"
                                                            >
                                                                ✏️
                                                            </button>
                                                        </div>
                                                    }>
                                                        <input
                                                            className="w-full bg-[#2a2a2a] text-white border border-[#444] rounded px-3 py-2"
                                                            value={tempData().country}
                                                            onInput={(e) => handleChange('country', e.target.value)}
                                                        />
                                                    </Show>
                                                </div>

                                                <div>
                                                    <p><span className="font-semibold">Người theo dõi:</span> {data().artist.followers}</p>
                                                </div>
                                            </>
                                        )}

                                        {/* Action Buttons */}
                                        <Show when={editField()}>
                                            <div className="flex justify-end gap-4 mt-4">
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-[#333] text-white px-4 py-2 rounded hover:bg-[#444]"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={saveChanges}
                                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                >
                                                    Lưu
                                                </button>
                                            </div>
                                        </Show>

                                        {/* Ghi chú cuối */}
                                        <p className="text-xs text-center text-[#777] pt-4">
                                            Bằng cách tiếp tục, bạn đồng ý cho phép Spotify truy cập vào hình ảnh bạn đã chọn để tải lên. Vui lòng đảm bảo bạn có quyền tải lên hình ảnh này.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Show>


                        {/* Dòng chữ "Đăng kí nghệ sĩ" */}

                        {!data()?.artist ? (
                            <button
                                onClick={handlePopupOpen}
                                className="rounded-full border border-[#1db954] bg-[#1db954] text-white px-4 py-2 text-sm font-medium hover:bg-[#1ed760] transition-colors"
                            >
                                Đăng ký nghệ sĩ
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowAddMusic(true)}
                                    className="rounded-full border border-[#1db954] bg-[#1db954] text-white px-4 py-2 text-sm font-medium hover:bg-[#1ed760] transition-colors"
                                >
                                    Thêm bài hát mới
                                </button>
                                <button
                                    onClick={() => setShowAddAlbum(true)}
                                    className="rounded-full border border-[#1db954] bg-[#1db954] text-white px-4 py-2 text-sm font-medium hover:bg-[#1ed760] transition-colors ml-2"
                                >
                                    Thêm Album mới
                                </button>
                            </>
                        )}

                        {showAddMusic() && (
                            <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
                                <div class="bg-[#121212] text-white p-8 rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-3xl font-bold text-white">🎵 Thêm bài hát mới</h3>
                                    <button
                                    onClick={handlePopupClose}
                                    class="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                                    >
                                    &times;
                                    </button>
                                </div>

                                <div class="space-y-5">
                                    <div>
                                    <label class="block mb-2 text-sm font-semibold text-gray-300">Tên bài hát</label>
                                    <input
                                        type="text"
                                        class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                        placeholder="Nhập tên bài hát..."
                                        onInput={(e) => setNewSong((s) => ({ ...s, title: e.target.value }))}
                                    />
                                    </div>

                                    <div>
                                    <label class="block mb-2 text-sm font-semibold text-gray-300">Ngày phát hành</label>
                                    <DatePicker
                                        class="w-full"
                                        inputClassName="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                        selectedDate={newSong().releaseDate}
                                        onChange={({ type, selectedDate }) => {
                                        if (type === 'single' && selectedDate) {
                                            const { year, month, day } = selectedDate;
                                            setNewSong((s) => ({
                                            ...s,
                                            releaseDate: new Date(year, month - 1, day),
                                            }));
                                        }
                                        }}
                                        dateFormat="dd/MM/yyyy"
                                        placeholder="Chọn ngày phát hành"
                                    />
                                    </div>

                                    <div>
                                    <input
                                        type="text"
                                        placeholder="Tìm nghệ sĩ cover cùng..."
                                        class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                        onInput={async (e) => {
                                        const query = e.target.value.toLowerCase();
                                        if (query.length > 1) {
                                            try {
                                            const data = await getAllArtistService();
                                            const filtered = data.artists.filter((artist) =>
                                                artist.name.toLowerCase().includes(query)
                                            );
                                            setSearchResults(filtered);
                                            } catch (error) {
                                            console.error('Lỗi tìm nghệ sĩ:', error);
                                            }
                                        } else {
                                            setSearchResults([]);
                                        }
                                        }}
                                    />
                                    <ul class="border border-gray-600 mt-1 rounded-xl overflow-y-auto max-h-40 bg-[#181818] text-sm text-white">
                                        {searchResults().map((artist) => (
                                        <li
                                            key={artist.id}
                                            class="cursor-pointer px-4 py-2 hover:bg-[#1db95433] border-b border-gray-700"
                                            onClick={() => {
                                            if (!newSong().featuredArtists.includes(artist.name)) {
                                                setNewSong((s) => ({
                                                ...s,
                                                featuredArtists: [...s.featuredArtists, artist],
                                                }));
                                            }
                                            }}
                                        >
                                            {artist.name}
                                        </li>
                                        ))}
                                    </ul>
                                    </div>

                                    <div class="flex flex-wrap gap-2">
                                    {newSong().featuredArtists.map((artist) => (
                                        <div
                                        key={artist}
                                        class="bg-[#1db95433] text-[#1db954] px-3 py-1 rounded-full flex items-center text-sm"
                                        >
                                        {artist.name}
                                        <button
                                            class="ml-2 text-red-400 hover:text-red-600"
                                            onClick={() => {
                                            setNewSong((s) => ({
                                                ...s,
                                                featuredArtists: s.featuredArtists.filter((n) => n !== artist),
                                            }));
                                            }}
                                        >
                                            &times;
                                        </button>
                                        </div>
                                    ))}
                                    </div>

                                    <div>
                                    <label class="block mb-2 text-sm font-semibold text-gray-300">Tải lên file nhạc</label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                        onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setNewSong((s) => ({ ...s, musicFile: file }));
                                        }}
                                    />
                                    <Show when={newSong().musicFile}>
                                        <p class="text-sm text-gray-400 mt-1">🎧 {newSong().musicFile.name}</p>
                                    </Show>
                                    </div>

                                    <div>
                                        <label class="block mb-2 text-sm font-semibold text-gray-300">Ảnh bìa</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                            onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setNewSong((s) => ({ ...s, cover: file }));
                                                setPreviewImage(URL.createObjectURL(file));
                                            }
                                            }}
                                        />
                                        <Show when={previewImage()}>
                                            <img
                                            src={previewImage()}
                                            alt="Ảnh bìa"
                                            class="mt-3 rounded-xl border border-gray-700 shadow max-w-full"
                                            style={{ maxWidth: '200px' }}
                                            />
                                        </Show>
                                    </div>

                                    <div>
                                    <label class="inline-flex items-center text-sm text-gray-300">
                                        <input
                                        type="checkbox"
                                        class="mr-2 accent-[#1db954]"
                                        onChange={(e) =>
                                            setNewSong((s) => ({
                                            ...s,
                                            ageRestricted: e.target.checked,
                                            }))
                                        }
                                        />
                                        Giới hạn tuổi
                                    </label>
                                    </div>

                                    <div class="text-right pt-4">
                                    <button
                                        onClick={handleAddMusicSubmit}
                                        class="px-6 py-2.5 rounded-full bg-[#1db954] text-white font-semibold hover:bg-[#1ed760] transition"
                                    >
                                        Gửi bài hát
                                    </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        )}

                        {showAddAlbum() && (
                            <div class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
                                <div class="bg-[#121212] text-white p-8 rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="text-3xl font-bold text-white">🎵 Thêm Album mới</h3>
                                    <button
                                    onClick={handlePopupClose}
                                    class="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                                    >
                                    &times;
                                    </button>
                                </div>

                                <div class="space-y-5">
                                    <div>
                                    <label class="block mb-2 text-sm font-semibold text-gray-300">Tên Album</label>
                                    <input
                                        type="text"
                                        class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                        placeholder="Nhập tên bài hát..."
                                        onInput={(e) => setNewAlbum((s) => ({ ...s, album_name: e.target.value }))}
                                    />
                                    </div>

                                    <div>
                                    <label class="block mb-2 text-sm font-semibold text-gray-300">Ngày phát hành</label>
                                    <DatePicker
                                        class="w-full"
                                        inputClassName="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                        selectedDate={newAlbum().releaseDate}
                                        onChange={({ type, selectedDate }) => {
                                        if (type === 'single' && selectedDate) {
                                            const { year, month, day } = selectedDate;
                                            setNewAlbum((s) => ({
                                            ...s,
                                            releaseDate: new Date(year, month - 1, day),
                                            }));
                                        }
                                        }}
                                        dateFormat="dd/MM/yyyy"
                                        placeholder="Chọn ngày phát hành"
                                    />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Tìm bài hát..."
                                            class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                            onInput=
                                            {
                                                async (e) => {
                                                    const query = e.target.value.toLowerCase();
                                                    if (query.length > 1) {
                                                        try {
                                                            const data_song = await getAllSongOfArtistByIdService(data().artist.id);
                                                            const filtered = data_song.songs.filter((song) =>
                                                                song.song_name.toLowerCase().includes(query)
                                                            );
                                                            console.log(filtered)
                                                            setSearchResults(filtered);
                                                        } catch (error) {
                                                            console.error('Lỗi tìm bài hát:', error);
                                                        }
                                                    } else {
                                                        setSearchResults([]);
                                                    }
                                                }
                                            }
                                        />
                                        <ul class="border border-gray-600 mt-1 rounded-xl overflow-y-auto max-h-40 bg-[#181818] text-sm text-white">
                                            {searchResults().map((song) => (
                                            <li
                                                key={song.id}
                                                class="cursor-pointer px-4 py-2 hover:bg-[#1db95433] border-b border-gray-700"
                                                onClick={() => {
                                                    //Kiểm tra xem id bài hát đã được thêm vào trước đó chưa
                                                    if (!newAlbum().songs.some((s) => s.id === song.id)) {
                                                        setNewAlbum((prev) => ({
                                                            ...prev,
                                                            songs: [...prev.songs, song],
                                                        }));
                                                    }
                                                }}
                                            >
                                                {song.song_name}
                                            </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div class="flex flex-wrap gap-2">
                                        {newAlbum().songs.map((song) => (
                                            <div
                                                key={song.id}
                                                class="bg-[#1db95433] text-[#1db954] px-3 py-1 rounded-full flex items-center text-sm"
                                            >
                                            {song.song_name}
                                            <button
                                                class="ml-2 text-red-400 hover:text-red-600"
                                                onClick={() => {
                                                    setNewAlbum((s) => ({
                                                        ...s,
                                                        songs: s.songs.filter((n) => n.id !== song.id),
                                                    }));
                                                }}
                                            >
                                                &times;
                                            </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div>
                                        <label class="block mb-2 text-sm font-semibold text-gray-300">Ảnh bìa</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            class="w-full bg-[#181818] text-white px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                                            onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setNewAlbum((s) => ({ ...s, album_picture: file }));
                                                setPreviewImage(URL.createObjectURL(file));
                                            }
                                            }}
                                        />
                                        <Show when={previewImage()}>
                                            <img
                                            src={previewImage()}
                                            alt="Ảnh bìa"
                                            class="mt-3 rounded-xl border border-gray-700 shadow max-w-full"
                                            style={{ maxWidth: '200px' }}
                                            />
                                        </Show>
                                    </div>

                                    <div class="text-right pt-4">
                                        <button
                                            onClick={handleAddAlbumSubmit}
                                            class="px-6 py-2.5 rounded-full bg-[#1db954] text-white font-semibold hover:bg-[#1ed760] transition"
                                        >
                                            Tạo album
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        )}

                        <div class="mt-10">
                            <h3 class="text-2xl font-semibold mb-4">
                                Danh sách phát của bạn
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <div class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition">
                                    <div class="h-40 bg-gray-700 rounded mb-3">
                                        <img
                                            className="h-[160px] w-[301px]"
                                            src="https://i1.sndcdn.com/artworks-cCIFzCliiKelihfy-txtCLw-t500x500.jpg"
                                        />
                                    </div>
                                    <h4 class="font-semibold">Chill Vibes</h4>
                                    <p class="text-sm text-gray-400">
                                        Playlist • 45 songs
                                    </p>
                                </div>
                                <div class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition">
                                    <div class="h-40 bg-gray-700 rounded mb-3">
                                        <img
                                            className="h-[160px] w-[301px]"
                                            src="https://i1.sndcdn.com/artworks-FDmrzyn7ptB28ynL-4CF7Ug-t500x500.jpg"
                                        />
                                    </div>
                                    <h4 class="font-semibold">Workout Hits</h4>
                                    <p class="text-sm text-gray-400">
                                        Playlist • 30 songs
                                    </p>
                                </div>
                                {/* Add more playlists here */}
                            </div>
                        </div>
                        
                        {/* Hiện danh sách album */}
                        {data()?.artist && (
                            <div class="mt-10">
                                <h3 class="text-2xl font-semibold mb-4">
                                    Các Album của bạn
                                </h3>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {allAlbum()?.map((album) => (
                                        <div class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition" onClick={() => handleOpenAlbum(album.id)}>
                                            <div class="relative w-full aspect-[2/1] bg-gray-700 rounded mb-3 overflow-hidden">
                                                <img
                                                    src={`${backendUrl}${album.album_picture}`}
                                                    alt={album.album_name}
                                                    class="absolute inset-0 w-full h-full object-cover"
                                                />
                                            </div>
                                            <h4 class="font-semibold text-white truncate">{album.album_name}</h4>
                                            <p class="text-sm text-gray-400">Album • {album.song_number} songs</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div class="mt-10">
                            <div className="flex justify-between">
                                <h3 class="text-2xl font-semibold mb-4">
                                    Đang theo dõi
                                </h3>
                                <span className="text-[#b3b3b3] font-bold text-sm hover:underline cursor-pointer">
                                    Hiện tất cả
                                </span>
                            </div>
                            <div
                                style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                            grid-template-rows: repeat(1, minmax(0, 1fr));"
                                className="grid pb-[60px]"
                            >
                                {followArtists.map((followArtist) => (
                                    <FollowArtists {...followArtist} />
                                ))}
                            </div>
                        </div>
                        <Footer />
                    </div>

                    {/* Popup đăng kí nghệ sĩ */}
                    {showPopup() && (
                        <div class="fixed inset-0 bg-black/70 bg-opacity-10 z-99 flex items-center justify-center transition-all duration-500 ease-in-out animate-fadeIn">
                            <div class="bg-[#282828] p-6 rounded-xl shadow-lg max-w-md w-full z-50 transform transition-all duration-500 ease-in-out animate-scaleIn">
                                <div class="flex justify-end">
                                    <button
                                        onClick={handlePopupClose}
                                        class="absolute bg-[#000000b3] rounded-[50%] h-8 w-8 flex justify-center items-center right-4 top-4 cursor-pointer hover:bg-[#121212] hover:text-white"
                                    >
                                        <svg
                                            role="img"
                                            viewBox="0 0 16 16"
                                            class="h-4 w-4 fill-current"
                                        >
                                            <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z"></path>
                                        </svg>
                                    </button>
                                </div>

                                {/* Thêm logo vào popup */}
                                <div class="text-center mb-4">
                                    <img
                                        src={
                                            `${backendUrl}${
                                                data().user.avatar_url
                                            }` || '/default-avatar.jpg'
                                        } // Đổi đường dẫn logo của bạn
                                        alt="Logo"
                                        className="w-16 h-16 mx-auto mb-3 rounded-[50%]"
                                    />
                                    <h3 class="text-2xl font-semibold mb-4 text-white">
                                        Đăng ký nghệ sĩ
                                    </h3>
                                </div>

                                <p class="text-sm text-white mb-4">
                                    Hãy đăng kí ngay hôm nay để được quyền đăng
                                    những bài hát độc quyền của bạn. Hãy kết nối
                                    ngay với chúng tôi.
                                </p>

                                <div>
                                    <label class="block text-sm text-white mb-2">
                                        Nhập link Facebook để đợi duyệt nếu
                                        chính chủ
                                    </label>
                                    <input
                                        type="text"
                                        value={facebookLink()}
                                        onInput={(e) =>
                                            setFacebookLink(e.target.value)
                                        }
                                        class="w-full p-2 rounded-lg bg-gray-100 text-sm text-gray-700"
                                        placeholder="Link Facebook"
                                    />
                                </div>

                                {/* Nút đăng kí */}
                                <div class="flex justify-end mt-4">
                                    <button
                                        onClick={sendArtistApproveForm} // Xử lý đăng kí
                                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <PanelContainer />
                </div>
            </Show>
        </>
    );
};

export default Profile;

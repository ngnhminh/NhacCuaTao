import { createSignal, createResource, Show, createEffect } from 'solid-js';
import {
    uploadAvatarService,
    getUserInformService,
    requestArtistApproveService,
    updateArtistInformService,
    requestSongApproveService,
    getAllArtistService,
} from '../../services/authService';
import { createGlobalStyles } from 'solid-styled-components';
import DatePicker from '@rnwonder/solid-date-picker';
import '@rnwonder/solid-date-picker/dist/style.css';
import Footer from '../layout/Footer';
import FollowArtists from '../components/sections/FollowArtists';
import SidePart from '../components/SidePart';
import PanelContainer from '../components/PanelContainer';

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
    const [uploading, setUploading] = createSignal(false);
    let fileInputRef;
    const [data, { refetch }] = createResource(getUserInformService);

    // logic (Long)
    const [fullName, setFullName] = createSignal('');

    const [showPopup, setShowPopup] = createSignal(false);
    const [showDetail, setShowDetail] = createSignal(false);
    const [showAddMusic, setShowAddMusic] = createSignal(false);
    const [facebookLink, setFacebookLink] = createSignal('');
    const [editField, setEditField] = createSignal(null);
    const [previewImage, setPreviewImage] = createSignal(null);
    const [searchResults, setSearchResults] = createSignal([]);
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

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Khi data load xong thì cập nhật formData
    createEffect(() => {
        if (data()) {
            setFullName(data().user.full_name); // Long

            setTempData({
                full_name: data().user.full_name,
                description: data().artist?.description || '',
                country: data().artist?.country || '',
            });
        }
    });

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
    };

    const handlePopupOpen = () => {
        setShowPopup(true);
    };

    // const saveChanges = async () => {
    //     await updateArtistInformService(tempData());
    //     console.log('Saved:', tempData());
    //     alert('Lưu thông tin thành công');
    //     refetch();
    //     setEditField(null);
    // };

    // Test logic (Long)
    const saveChanges = async () => {
        await updateArtistInformService({ full_name: fullName() });
        console.log('Saved:', fullName());
        alert('Lưu thông tin thành công');
        refetch();
        setEditField(null);
    };

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

    return (
        <>
            <GlobalStyles />
            <Show when={data()} fallback={<div>Loading...</div>}>
                <div class="flex h-[calc(100vh-64px-72px)] gap-3 px-3 pb-3 pt-1 overflow-hidden w-full bg-base-300">
                    <SidePart />
                    <div className="overflow-auto p-6">
                        <div
                            class="rounded-xl shadow-xl hover:shadow-2xl transition cursor-pointer"
                            onClick={() => setShowDetail(true)}
                        >
                            <div class="flex items-center gap-6 pb-6">
                                <div class="relative group">
                                    <img
                                        src={
                                            `${backendUrl}${
                                                data().user.avatar_url
                                            }` || '/default-avatar.jpg'
                                        }
                                        alt="Avatar"
                                        class="w-[144px] h-[144px] rounded-full object-cover border-4 border-white shadow-md"
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
                                        <div class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                            <span class="text-sm">
                                                Uploading...
                                            </span>
                                        </div>
                                    </Show>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="text-sm">Hồ sơ</div>
                                    <h1 class="text-5xl font-bold">
                                        {data().user.full_name}
                                    </h1>
                                    <div className="text-base">
                                        • 11 đang theo dõi
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Show when={showDetail()}>
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99">
                                <div class="flex bg-[#282828] rounded-[8px] w-[524px] flex-col text-[#b3b3b3] relative max-w-[calc(100vw-32px)] max-h-[calc(100vw-32px)]">
                                    <div class="flex justify-between items-center p-6">
                                        <h3 class="text-xl font-bold text-white">
                                            Chi Tiết Thông Tin
                                        </h3>
                                        <button
                                            className="absolute bg-[#000000b3] rounded-[50%] h-8 w-8 flex justify-center items-center right-4 top-4 cursor-pointer hover:bg-[#121212] hover:text-white"
                                            onClick={() => setShowDetail(false)}
                                        >
                                            <svg
                                                role="img"
                                                viewBox="0 0 16 16"
                                                className="h-4 w-4 fill-current"
                                            >
                                                <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Full name */}
                                    <div class="flex items-center px-6 pb-6">
                                        <Show
                                            when={editField() === 'full_name'}
                                            fallback={
                                                <>
                                                    <img
                                                        className="w-[180px] h-[180px] rounded-[50%]"
                                                        src="http://localhost:8000/media/avatars/681436998a3277bcca3d1895_Frame_2.jpg"
                                                    />
                                                    {/* <p>
                                                    <span class="font-semibold">
                                                        Tên:
                                                    </span>{' '}
                                                    {data()?.user.full_name}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        setEditField(
                                                            'full_name'
                                                        )
                                                    }
                                                    class="text-sm text-blue-600"
                                                >
                                                    ✏️
                                                </button> */}
                                                    <div className="relative">
                                                        <label className="absolute text-[#b3b3b3] left-6 top-[-8px] text-xs font-bold">
                                                            Tên
                                                        </label>
                                                        <input
                                                            className="bg-[#ffffff1a] border border-transparent rounded-sm text-white text-sm h-10 px-3 ml-4 w-full focus:bg-[#333] focus:border-[#535353] outline-none"
                                                            placeholder="Thêm tên hiển thị"
                                                            value={fullName()}
                                                            onInput={(e) =>
                                                                setFullName(
                                                                    e
                                                                        .currentTarget
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                        <button
                                                            onClick={
                                                                saveChanges
                                                            }
                                                            className="font-bold text-[1rem] rounded-[999px] ml-[200px] bg-white text-black cursor-pointer px-8 py-2 mt-4 hover:scale-[1.04] hover:bg-[#f0f0f0]"
                                                        >
                                                            Lưu
                                                        </button>
                                                    </div>
                                                </>
                                            }
                                        >
                                            <input
                                                class="border rounded px-2 py-1 w-full"
                                                value={tempData().full_name}
                                                onInput={(e) =>
                                                    handleChange(
                                                        'full_name',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Show>
                                    </div>

                                    {/* Nghệ danh */}
                                    {data()?.artist && (
                                        <>
                                            <div class="mb-2">
                                                <p>
                                                    <span class="font-semibold">
                                                        Nghệ Danh:
                                                    </span>{' '}
                                                    {data().artist.artist_name}
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <div class="flex justify-between items-center mb-2">
                                                <Show
                                                    when={
                                                        editField() ===
                                                        'description'
                                                    }
                                                    fallback={
                                                        <>
                                                            <p>
                                                                <span class="font-semibold">
                                                                    Mô tả:
                                                                </span>{' '}
                                                                {
                                                                    data()
                                                                        .artist
                                                                        .description
                                                                }
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    setEditField(
                                                                        'description'
                                                                    )
                                                                }
                                                                class="text-sm text-blue-600"
                                                            >
                                                                ✏️
                                                            </button>
                                                        </>
                                                    }
                                                >
                                                    <input
                                                        class="border rounded px-2 py-1 w-full"
                                                        value={
                                                            tempData()
                                                                .description
                                                        }
                                                        onInput={(e) =>
                                                            handleChange(
                                                                'description',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Show>
                                            </div>

                                            {/* Country */}
                                            <div class="flex justify-between items-center mb-2">
                                                <Show
                                                    when={
                                                        editField() ===
                                                        'country'
                                                    }
                                                    fallback={
                                                        <>
                                                            <p>
                                                                <span class="font-semibold">
                                                                    Country:
                                                                </span>{' '}
                                                                {
                                                                    data()
                                                                        .artist
                                                                        .country
                                                                }
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    setEditField(
                                                                        'country'
                                                                    )
                                                                }
                                                                class="text-sm text-blue-600"
                                                            >
                                                                ✏️
                                                            </button>
                                                        </>
                                                    }
                                                >
                                                    <input
                                                        class="border rounded px-2 py-1 w-full"
                                                        value={
                                                            tempData().country
                                                        }
                                                        onInput={(e) =>
                                                            handleChange(
                                                                'country',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Show>
                                            </div>

                                            <div class="mb-2">
                                                <p>
                                                    <span class="font-semibold">
                                                        Số người theo dõi:
                                                    </span>{' '}
                                                    {data().artist.followers}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {/* Save/Cancel buttons */}
                                    <Show when={editField()}>
                                        <div class="flex justify-end mt-4 gap-2">
                                            <button
                                                onClick={cancelEdit}
                                                class="bg-gray-200 px-4 py-2 rounded"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={saveChanges}
                                                class="bg-blue-600 text-white px-4 py-2 rounded"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </Show>
                                    <p className="font-bold text-xs text-white px-6 pb-6">
                                        Bằng cách tiếp tục, bạn đồng ý cho phép
                                        Spotify truy cập vào hình ảnh bạn đã
                                        chọn để tải lên. Vui lòng đảm bảo bạn có
                                        quyền tải lên hình ảnh.
                                    </p>
                                </div>
                            </div>
                        </Show>

                        {/* Dòng chữ "Đăng kí nghệ sĩ" */}

                        {!data()?.artist && (
                            <button
                                onClick={handlePopupOpen}
                                class="mt-6 px-4 py-1 rounded-[9999px] border border-[#818181] text-base hover:scale-[1.02] cursor-pointer hover:border-[#12c04c] hover:text-[#12c04c]"
                            >
                                Đăng ký nghệ sĩ
                            </button>
                        )}

                        {data()?.artist && (
                            <div class="mt-4 text-center">
                                <button
                                    onClick={() => setShowAddMusic(true)}
                                    class="text-sm text-blue-500 underline cursor-pointer"
                                >
                                    Thêm bài hát mới
                                </button>
                            </div>
                        )}

                        {showAddMusic() && (
                            <div class="fixed inset-0 bg-gray-400 bg-opacity-10 z-40 flex items-center justify-center backdrop-blur-md animate-fadeIn">
                                <div class="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full max-h-[75vh] overflow-y-auto animate-scaleIn">
                                    <div class="flex justify-between items-center mb-6">
                                        <h3 class="text-2xl font-semibold text-gray-800">
                                            Thêm bài hát mới
                                        </h3>
                                        <button
                                            onClick={handlePopupClose}
                                            class="text-gray-500 hover:text-red-500 text-lg font-bold transition"
                                            aria-label="Đóng popup"
                                        >
                                            &times;
                                        </button>
                                    </div>

                                    <div class="mb-4">
                                        <label class="block mb-1 text-sm font-medium text-gray-700">
                                            Tên bài hát
                                        </label>
                                        <input
                                            type="text"
                                            class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                                            placeholder="Nhập tên bài hát..."
                                            onInput={(e) =>
                                                setNewSong((s) => ({
                                                    ...s,
                                                    title: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div class="mb-4">
                                        <label class="block mb-1 text-sm font-medium text-gray-700">
                                            Ngày phát hành
                                        </label>
                                        <DatePicker
                                            class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
                                            inputClassName="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
                                            selectedDate={newSong().releaseDate}
                                            onChange={({
                                                type,
                                                selectedDate,
                                            }) => {
                                                if (
                                                    type === 'single' &&
                                                    selectedDate
                                                ) {
                                                    const { year, month, day } =
                                                        selectedDate;
                                                    const validDate = new Date(
                                                        year,
                                                        month - 1,
                                                        day
                                                    ); // month bắt đầu từ 0
                                                    setNewSong((s) => ({
                                                        ...s,
                                                        releaseDate: validDate,
                                                    }));
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            placeholder="Chọn ngày phát hành"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Tìm nghệ sĩ cover cùng..."
                                        class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-gray-700"
                                        onInput={async (e) => {
                                            const query =
                                                e.target.value.toLowerCase();
                                            if (query.length > 1) {
                                                try {
                                                    const data =
                                                        await getAllArtistService();
                                                    const filtered =
                                                        data.artists.filter(
                                                            (artist) =>
                                                                artist.name
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        query
                                                                    )
                                                        );
                                                    setSearchResults(filtered);
                                                } catch (error) {
                                                    console.error(
                                                        'Lỗi tìm nghệ sĩ:',
                                                        error
                                                    );
                                                }
                                            } else {
                                                setSearchResults([]);
                                            }
                                        }}
                                    />

                                    <ul class="block mb-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                                        {searchResults().map((artist) => (
                                            <li
                                                key={artist.id}
                                                class="cursor-pointer px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                                                onClick={() => {
                                                    if (
                                                        !newSong().featuredArtists.includes(
                                                            artist.name
                                                        )
                                                    ) {
                                                        setNewSong((s) => ({
                                                            ...s,
                                                            featuredArtists: [
                                                                ...s.featuredArtists,
                                                                artist,
                                                            ],
                                                        }));
                                                    }
                                                }}
                                            >
                                                {artist.name}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Danh sách nghệ sĩ đã chọn, có thể xoá */}
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        {newSong().featuredArtists.map(
                                            (name) => (
                                                <div
                                                    key={name}
                                                    class="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {name}
                                                    <button
                                                        class="ml-2 text-red-500 hover:text-red-700"
                                                        onClick={() => {
                                                            setNewSong((s) => ({
                                                                ...s,
                                                                featuredArtists:
                                                                    s.featuredArtists.filter(
                                                                        (n) =>
                                                                            n !==
                                                                            name
                                                                    ),
                                                            }));
                                                        }}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Tải lên file nhạc */}
                                    <div class="mb-4">
                                        <label class="block mb-1 text-sm font-medium text-gray-700">
                                            Tải lên file nhạc
                                        </label>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            class="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-auto"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setNewSong((s) => ({
                                                        ...s,
                                                        musicFile: file,
                                                    }));
                                                }
                                            }}
                                        />
                                        <Show when={newSong().musicFile}>
                                            <p class="text-sm text-gray-600 mt-1">
                                                🎵 File:{' '}
                                                {newSong().musicFile.name}
                                            </p>
                                        </Show>
                                    </div>

                                    {/* Ảnh bìa */}
                                    <div class="mb-4">
                                        <label class="block mb-1 text-sm font-medium text-gray-700">
                                            Ảnh bìa
                                        </label>
                                        <div class="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                class="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-auto"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    if (file) {
                                                        setNewSong((s) => ({
                                                            ...s,
                                                            cover: file,
                                                        }));
                                                        const imageUrl =
                                                            URL.createObjectURL(
                                                                file
                                                            );
                                                        setPreviewImage(
                                                            imageUrl
                                                        );
                                                    }
                                                }}
                                            />
                                            <Show when={newSong().cover}>
                                                <p class="text-sm text-gray-600 mt-1">
                                                    📸 File:{' '}
                                                    {newSong().cover.name}
                                                </p>
                                            </Show>
                                            {previewImage() && (
                                                <div class="mt-3">
                                                    <img
                                                        src={previewImage()}
                                                        alt="Ảnh bìa"
                                                        class="rounded shadow-md border border-gray-300 max-w-full"
                                                        style={{
                                                            maxWidth: '200px',
                                                            height: 'auto',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Giới hạn tuổi */}
                                    <div class="mb-6">
                                        <label class="flex items-center text-sm text-gray-700">
                                            <input
                                                type="checkbox"
                                                class="mr-2 accent-blue-600"
                                                onChange={(e) =>
                                                    setNewSong((s) => ({
                                                        ...s,
                                                        ageRestricted:
                                                            e.target.checked,
                                                    }))
                                                }
                                            />
                                            Giới hạn tuổi
                                        </label>
                                    </div>

                                    {/* Nút Gửi */}
                                    <div class="text-right">
                                        <button
                                            onClick={handleAddMusicSubmit}
                                            class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                        >
                                            Gửi
                                        </button>
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

import {
    createSignal,
    createResource,
    Show,
    onMount,
    createEffect, createMemo, onCleanup
} from 'solid-js';
import { Logo, Home } from '../../public/Icon.jsx';
import { logoutService, getUserInformService, getAllNotificationService } from '../../services/authService';
import {
    getAllArtistService,
    getAllSongOfArtistService, notificationReadedService
} from '../../services/authService';
import { useNavigate } from '@solidjs/router';
import { useAuth } from '../layout/AuthContext';
import { initFlowbite } from 'flowbite';
import  useSocketNotification  from '../hooks/useSocketNotification';
import NotificationCard from '../components/NotificationCard';
import {transferNotification, transferNotificationForArtist} from "../stores/notificationStore";

const NavbarLogin = () => {
    let dropdownRef;
    let buttonRef;
    const [dropdownVisible, setDropdownVisible] = createSignal(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const auth = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = createSignal([]);
    const [isOpen, setIsOpen] = createSignal(false);
    const { closeSocket } = useSocketNotification();
    // Lấy thông tin người dùng
    const [data] = createResource(getUserInformService);

    const handleFocus = () => setDropdownVisible(true);
    const handleBlur = () => setDropdownVisible(false);

    const unreadCount = createMemo(() =>
        notifications().filter(n => n.status === 0).length
    );

    onMount(() => {
        initFlowbite();
        reloadNotification();
    });

    //Khởi tạo sự kiện khi bấm ra ngoài đói với dropdown thông báo
   
    onMount(() => {
        const handleClickOutside = (e) => {
            if (
            dropdownRef &&
            !dropdownRef.contains(e.target) &&
            buttonRef &&
            !buttonRef.contains(e.target)
            ) {
            setIsOpen(false);
            notificationReadedHandle();
            }
        };

        window.addEventListener('click', handleClickOutside);
        onCleanup(() => {
            window.removeEventListener('click', handleClickOutside);
        });
    });

    const logoutHandle = async () => {
        try {
            closeSocket();
            await logoutService();
            auth.setIsLoggedIn(false);
            auth.setIsOpenProfile(false);
            auth.setIsArtist(false);
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    createEffect(() => {
        const newNotification = auth.isArtist()
            ? transferNotificationForArtist()
            : transferNotification();
        if (newNotification) {
            setNotifications(prev => [newNotification.message, ...prev]);
            // notifications().forEach((artist) => {
            //     console.log(artist.message);
            // });
        }
    })

    const reloadNotification = async () => {
        try{
            const result = auth.isArtist() 
                ? await getAllNotificationService("artist")
                : await getAllNotificationService("user")
            setNotifications(result.notificationList);
            console.log("Kiểm tra" + result.notificationList)
        }catch (err) {
            console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }

    const notificationReadedHandle = async () => {
        try{
            const result = auth.isArtist() 
                ? await notificationReadedService("artist")
                : await notificationReadedService("user")
            if(result.isDone){
                reloadNotification();
            } 
        }catch (err) {
            console.error("Lỗi khi load danh sách yêu thích:", err);
        }
    }

    const backToHomeHandle = () => {
        auth.setIsOpenProfile(false);
        navigate('/');
    };

    const openProfileHandle = () => {
        // auth.setIsOpenProfile(true);
        navigate('/profile');
    };

    // Hàm tìm kiếm sử dụng debounce
    let timer;
    const handleSearch = (e) => {
        navigate('/');
        clearTimeout(timer);
        if (!auth.isOpenSearchPage()) {
            auth.setIsOpenSearchPage(true);
        }
        const query = e.target.value.toLowerCase();
        timer = setTimeout(async () => {
            if (query.length >= 1) {
                try {
                    const artistList = await getAllArtistService();
                    const songList = await getAllSongOfArtistService();
                    const filtered = artistList.artists.filter((artist) =>
                        artist.name.toLowerCase().includes(query)
                    );
                    const filteredSong = songList.songs.filter((song) =>
                        song.song_name.toLowerCase().includes(query)
                    );
                    auth.setResults(filtered);
                    auth.setResultsSong(filteredSong);
                } catch (error) {
                    console.error('Lỗi tìm nghệ sĩ:', error);
                }
            } else {
                auth.setIsOpenSearchPage(false)
                auth.setResults([]);
            }
        }, 300);
    };

    return (
        <header className="antialiased sticky top-0 left-0 right-0 z-50 dark:bg-base-300">
            <nav className="bg-black border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-base-300">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex justify-start items-center">
                        <a href="/" className="flex mr-4 gap-2">
                            <Logo />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Spotify
                            </span>
                        </a>
                        <button
                            className="btn btn-circle h-12 w-12 btn-soft bg-base-100/70 border-none hover:scale-110 hover:brightness-110 transition-all duration-200 hover:bg-base-100"
                            onClick={backToHomeHandle}
                        >
                            <Home />
                        </button>

                        <form
                            autoComplete="off"
                            action="#"
                            method="GET"
                            className="hidden lg:block lg:pl-2 outline-none"
                        >
                            <div className="relative mt-1 lg:w-96">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-base-content"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>

                                <input
                                    type="search"
                                    name="search"
                                    id="topbar-search"
                                    className="border-none ring-base-content focus:ring-2 text-gray-900 sm:text-sm rounded-full block w-full pl-9 p-2.5 dark:bg-base-100 dark:placeholder-base-content dark:text-white"
                                    placeholder="Bạn muốn phát nội dung gì?"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onInput={handleSearch}
                                />

                                {/* {dropdownVisible() && (
                                    <div className="absolute left-0 right-0 mt-1 bg-base-100 shadow-lg rounded-md z-50 p-2 text-sm dark:bg-base-200">
                                        <p className="py-1 px-3 text-white font-bold rounded">
                                            Các tìm kiếm gần đây
                                        </p>
                                        <ul>
                                            <li>
                                                <div className="flex items-center justify-between rounded-md cursor-pointer p-2 hover:bg-[#3f3f3f] hover:text-white group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12">
                                                            <img
                                                                className="w-full h-full rounded-[4px]"
                                                                src="https://i.scdn.co/image/ab67616d0000b273051d84b6cac537e613b6d5a9"
                                                                alt="Album"
                                                            />
                                                            <span
                                                                aria-hidden="true"
                                                                className="absolute rounded-[4px] p-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition bg-black/50"
                                                            >
                                                                <svg
                                                                    data-encore-id="icon"
                                                                    role="img"
                                                                    aria-hidden="true"
                                                                    viewBox="0 0 24 24"
                                                                    width="24"
                                                                    height="24"
                                                                    fill="currentColor"
                                                                >
                                                                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
                                                                </svg>
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="text-white cursor-pointer hover:underline">
                                                                The Roar of the
                                                                Spark
                                                            </div>
                                                            <div className="text-[14px] text-white">
                                                                NAOKI, Arc
                                                                System Works
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button className="py-2 cursor-pointer hover:scale-105 hover:text-white hover:transition duration-[50ms]">
                                                        <span
                                                            aria-hidden="true"
                                                            className="opacity-0 group-hover:opacity-100 transition duration-150"
                                                        >
                                                            <svg
                                                                role="img"
                                                                aria-hidden="true"
                                                                viewBox="0 0 16 16"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06Z" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                )} */}
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center lg:order-2 lg:px-4 relative">
                        <button
                            id="toggleSidebarMobileSearch"
                            type="button"
                            className="btn btn-circle btn-ghost dark:hover:bg-base-100 lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white"
                        >
                            <span className="sr-only">Search</span>
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </button>

                        {/* Notification button with Flowbite dropdown */}
                        <div className="relative">
                            <div className="relative">
                                <button
                                ref={(el) => (buttonRef = el)}
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="btn btn-circle btn-ghost dark:hover:bg-base-100 mr-1 text-base-content hover:text-gray-900 hover:bg-gray-100 dark:text-base-content dark:hover:text-white"
                                >
                                <span className="sr-only">View notifications</span>
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 14 20"
                                >
                                    <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
                                </svg>

                                {/* Badge đỏ */}
                                <Show when={unreadCount() > 0}>
                                    <span className="absolute top-0 right-0 rounded-full bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center translate-x-1/2 -translate-y-1/2">
                                    {unreadCount()}
                                    </span>
                                </Show>
                                </button>
                            </div>

                            <Show when={isOpen()}>
                                <div
                                ref={(el) => (dropdownRef = el)}
                                className="absolute right-0 mt-2 z-50 w-64 max-h-100 overflow-y-auto bg-white rounded-lg shadow dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700"
                                >
                                <div className="p-3 text-sm text-gray-900 dark:text-white font-medium">
                                    Thông báo
                                </div>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                    <For
                                    each={notifications()}
                                    fallback={
                                        <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                        Không có thông báo nào.
                                        </div>
                                    }
                                    >
                                    {(notification) => <NotificationCard {...notification} />}
                                    </For>
                                </ul>
                                </div>
                            </Show>
                        </div>

                        <button
                            type="button"
                            className="btn btn-circle overflow-hidden mx-3 hover:scale-105 hover:brightness-110 transition-all duration-200 md:mr-0"
                            id="user-menu-button"
                            data-dropdown-toggle="user-dropdown"
                            data-dropdown-placement="bottom-end"
                        >
                            <Show
                                when={data()}
                                fallback={
                                    <div className="w-full h-full animate-pulse bg-gray-300 rounded-full"></div>
                                }
                            >
                                <img
                                    className="size-full object-cover"
                                    src={
                                        data().user.avatar_url
                                            ? `${backendUrl}${
                                                  data().user.avatar_url
                                              }`
                                            : 'https://i.pinimg.com/474x/45/a2/2b/45a22b2285f2f60cf3a9c4739fe24b70.jpg'
                                    }
                                    alt="user photo"
                                />
                            </Show>
                        </button>

                        {/* User dropdown menu (hidden by default) */}
                        <div
                            className="hidden z-50 w-56 text-base list-none bg-white rounded-md divide-y divide-gray-100 shadow dark:bg-base-200/95 dark:divide-gray-600"
                            id="user-dropdown"
                        >
                            <div className="py-3 px-4">
                                <Show when={data()}>
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                                        {data().user.full_name}
                                    </span>
                                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                        {data().user.email}
                                    </span>
                                </Show>
                            </div>
                            <ul
                                className="py-1 text-gray-500 dark:text-gray-400"
                                aria-labelledby="user-dropdown"
                            >
                                <li>
                                    <a
                                        href="/profile"
                                        className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                        onClick={openProfileHandle}
                                    >
                                        Hồ sơ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Cài đặt tài khoản
                                    </a>
                                </li>
                            </ul>
                            <ul
                                className="py-1 text-gray-500 dark:text-gray-400"
                                aria-labelledby="user-dropdown"
                            >
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        <svg
                                            className="mr-2 w-4 h-4 text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 18"
                                        >
                                            <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z" />
                                        </svg>
                                        Các bài hát yêu thích
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        <svg
                                            className="mr-2 w-4 h-4 text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="m1.56 6.245 8 3.924a1 1 0 0 0 .88 0l8-3.924a1 1 0 0 0 0-1.8l-8-3.925a1 1 0 0 0-.88 0l-8 3.925a1 1 0 0 0 0 1.8Z" />
                                            <path d="M18 8.376a1 1 0 0 0-1 1v.163l-7 3.434-7-3.434v-.163a1 1 0 0 0-2 0v.786a1 1 0 0 0 .56.9l8 3.925a1 1 0 0 0 .88 0l8-3.925a1 1 0 0 0 .56-.9v-.786a1 1 0 0 0-1-1Z" />
                                            <path d="M17.993 13.191a1 1 0 0 0-1 1v.163l-7 3.435-7-3.435v-.163a1 1 0 1 0-2 0v.787a1 1 0 0 0 .56.9l8 3.925a1 1 0 0 0 .88 0l8-3.925a1 1 0 0 0 .56-.9v-.787a1 1 0 0 0-1-1Z" />
                                        </svg>
                                        Bộ sưu tập
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex justify-between items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        <span className="flex items-center">
                                            <svg
                                                className="mr-2 w-4 h-4 text-primary-600 dark:text-primary-500"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="m7.164 3.805-4.475.38L.327 6.546a1.114 1.114 0 0 0 .63 1.89l3.2.375 3.007-5.006ZM11.092 15.9l.472 3.14a1.114 1.114 0 0 0 1.89.63l2.36-2.362.38-4.475-5.102 3.067Zm8.617-14.283A1.613 1.613 0 0 0 18.383.291c-1.913-.33-5.811-.736-7.556 1.01-1.98 1.98-6.172 9.491-7.477 11.869a1.1 1.1 0 0 0 .193 1.316l.986.985.985.986a1.1 1.1 0 0 0 1.316.193c2.378-1.3 9.889-5.5 11.869-7.477 1.746-1.745 1.34-5.643 1.01-7.556Zm-3.873 6.268a2.63 2.63 0 1 1-3.72-3.72 2.63 2.63 0 0 1 3.72 3.72Z" />
                                            </svg>
                                            Phiên bản Pro
                                        </span>
                                        <svg
                                            className="w-2.5 h-2.5 text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 6 10"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 9 4-4-4-4"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                            <ul
                                className="py-1 text-gray-500 dark:text-gray-400"
                                aria-labelledby="user-dropdown"
                            >
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={logoutHandle}
                                    >
                                        Đăng xuất
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavbarLogin;

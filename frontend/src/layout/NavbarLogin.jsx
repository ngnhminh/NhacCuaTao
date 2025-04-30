import { createSignal, createResource } from "solid-js";
import { Logo, Home } from "../../public/Icon.jsx";
import { logoutService, getUserInformService} from "/./services/authService";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../layout/AuthContext";

const NavbarLogin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const MEDIA_URL = "http://localhost:8000";

  const auth = useAuth();
  const navigate = useNavigate();

  //Lấy thông tin người dùng
  const [data] = createResource(getUserInformService);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const logoutHandle = async () => {
    try{
        await logoutService();
        auth.setIsLoggedIn(false); 
        navigate("/");
    }catch(err){
        console.log(err);
    }
  }

  const backToHomeHandle = () => {
    auth.setIsOpenProfile(false);
    navigate("/");
  }

  const openProfileHandle = () => {
    auth.setIsOpenProfile(true); 
  }

  return (
    <header className="antialiased sticky top-0 left-0 right-0 z-999 dark:bg-base-300">
      <nav className="bg-black border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-base-300">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <a href="" className="flex mr-4 gap-2">
              <Logo />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Spotify
              </span>
            </a>
            <button
              className="btn btn-circle btn-soft bg-base-100/70 border-none hover:scale-110 hover:brightness-110 transition-all duration-200 hover:bg-base-100"
              onClick={backToHomeHandle}
            >
              <Home />
            </button>

            <form action="#" method="GET" className="hidden lg:block lg:pl-2 outline-none">
              <label for="topbar-search" className="sr-only">Search</label>
              <div className="relative mt-1 lg:w-96">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-base-content" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input
                  type="search"
                  name="email"
                  id="topbar-search"
                  className="border-none ring-base-content focus:ring-2 text-gray-900 sm:text-sm rounded-full block w-full pl-9 p-2.5 dark:bg-base-100 dark:placeholder-base-content dark:text-white"
                  placeholder="Search"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center lg:order-2 lg:px-4">
            <button
              id="toggleSidebarMobileSearch"
              type="button"
              className="btn btn-circle btn-ghost dark:hover:bg-base-100 lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white"
            >
              <span className="sr-only">Search</span>
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </button>

            <button
              type="button"
              data-dropdown-toggle="notification-dropdown"
              className="btn btn-circle btn-ghost dark:hover:bg-base-100 mr-1 text-base-content hover:text-gray-900 hover:bg-gray-100 dark:text-base-content dark:hover:text-white"
            >
              <span className="sr-only">View notifications</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
              </svg>
            </button>

            <button
              type="button"
              className="btn btn-circle overflow-hidden mx-3 hover:scale-105 hover:brightness-110 transition-all duration-200 md:mr-0"
              id="user-menu-button"
              onClick={toggleDropdown}
            >
              <Show when={data()} fallback={<div class="w-full h-full animate-pulse bg-gray-300 rounded-full"></div>}>
                <img
                  className="size-full object-cover"
                  src={data().user.avatar_url ? MEDIA_URL + data().user.avatar_url : "/default-avatar.jpg"}
                  alt="user photo"
                />
              </Show>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen() && (
              <div className="absolute top-full right-3 z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-base-200/95 dark:divide-gray-600">
                <Show when={data()} fallback={<div class="py-3 px-4">Loading...</div>}>
                  <div class="py-3 px-4">
                    <span class="block text-sm font-semibold text-gray-900 dark:text-white">{data().user.full_name}</span>
                    <span class="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {data().user.email}
                    </span>
                  </div>
                </Show>
                <ul className="py-1 text-gray-500 dark:text-gray-400">
                  <li>
                    <a onClick={openProfileHandle} href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">My profile</a>
                  </li>
                  <li>
                    <a href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">Account settings</a>
                  </li>
                </ul>
                <ul className="py-1 text-gray-500 dark:text-gray-400">
                  <li>
                    <a href="#" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My likes</a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Collections</a>
                  </li>
                </ul>
                <ul className="py-1 text-gray-500 dark:text-gray-400">
                  <li>
                    <a onClick={logoutHandle} href="#" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavbarLogin;

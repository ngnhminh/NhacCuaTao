import { Logo, Home } from "../../public/Icon.jsx";
import { A } from "@solidjs/router";

const NavbarLogin = () => {
    
  return (
  <header className="antialiased sticky top-0 left-0 right-0 z-999  dark:bg-base-300 ">
    <nav className="bg-black border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-base-300">
        <div className="flex flex-wrap justify-between items-center">
            <div className="flex justify-start items-center">
                {/* <SidebarToggleButton onClick={toggleSidebar} /> */}
                <a href="" className="flex mr-4 gap-2">
                    <Logo />
                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Spotify</span>
                </a>
                <button className="btn btn-circle btn-soft bg-base-100/70 border-none hover:scale-110 hover:brightness-110 transition-all duration-200 hover:bg-base-100" onClick={() => window.location.href = "/"}>
                    <Home  />
                </button>

                <form action="#" method="GET" className="hidden lg:block lg:pl-2 outline-none">
                  <label for="topbar-search" className="sr-only">Search</label>
                  <div className="relative mt-1 lg:w-96">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-base-content " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/> </svg>
                    </div>
                    <input type="search" name="email" id="topbar-search" className=" border-none ring-base-content focus:ring-2 text-gray-900 sm:text-sm rounded-full block w-full pl-9 p-2.5 dark:bg-base-100 dark:placeholder-base-content dark:text-white " placeholder="Search"/>
                  </div>
                </form> 
              </div>
            <div className="flex items-center lg:order-2 lg:px-4">

                <button id="toggleSidebarMobileSearch" type="button" className="btn btn-circle btn-ghost dark:hover:bg-base-100 lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white">
                    <span className="sr-only">Search</span>
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                </button>

                <A
                href="/login"
                class="btn overflow-hidden mx-3 duration-200 md:mr-0 bg-transparent bg-white text-black cursor-pointer font-bold"
                id="login-button"
                >
                Log in
                </A>

                <A
                href="/register"
                class="btn overflow-hidden mx-3 mr-3 hover:brightness-110 transition-all duration-200 md:mr-0 text-white"
                id="register-button"
                >
                Sign up
                </A>

            </div>
        </div>
    </nav>

  </header>
  );
};

export default NavbarLogin;
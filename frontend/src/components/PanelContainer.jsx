import { createSignal } from 'solid-js';
import SidebarLeftResizer from './SidebarLeftResizer';
import { isSidebarVisible } from '../signal/sidebarStore';

const SidePart = () => {
    let sidebarRef;
    const [sidebarWidth, setSidebarWidth] = createSignal('420px');

    return (
        <>
            <aside
                id="default-sidebar"
                ref={(el) => (sidebarRef = el)}
                style={{ width: sidebarWidth() }}
                class={`${
                    isSidebarVisible() ? 'flex' : 'hidden'
                } flex-none relative overflow-hidden max-w-[420px] rounded-md`}
                aria-label="Sidenav"
            >
                <SidebarLeftResizer
                    sidebarRef={sidebarRef}
                    setSidebarWidth={setSidebarWidth}
                />

                <div
                    className={`flex flex-col items-stretch space-y-3 relative py-4 px-4 h-full dark:bg-base-200 overflow-y-auto`}
                >
                    <div className="font-bold text-white mb-4">
                        Guilty Gear Strive + DLC
                    </div>
                    <div class="">
                        <img
                            className="rounded-md"
                            src="https://i.scdn.co/image/ab67616d0000b273051d84b6cac537e613b6d5a9"
                        />
                    </div>

                    <div className="flex justify-between">
                        <div>
                            <span>
                                <a
                                    href="#"
                                    className="text-2xl text-white font-bold hover:underline"
                                >
                                    Find Your One Way
                                </a>
                            </span>
                            <div>
                                <span>
                                    <a
                                        href="#"
                                        className="hover:underline hover:text-white"
                                    >
                                        NAOKI
                                    </a>
                                </span>
                                <span>
                                    ,{' '}
                                    <a
                                        href="#"
                                        className="hover:underline hover:text-white"
                                    >
                                        Arc System Works
                                    </a>
                                </span>
                            </div>
                        </div>
                        <button className="py-3 ml-3 cursor-pointer hover:text-white">
                            <span aria-hidden="true">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                >
                                    <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11z"></path>
                                    <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1z"></path>
                                </svg>
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col items-stretch space-y-3 relative py-4  px-4 h-full rounded-md  dark:bg-[#1f1f1f]">
                        <div className="flex items-center h-[25px] justify-between">
                            <h2 className="font-bold text-white max-w-[197px] truncate">
                                Người tham gia thực hiện
                            </h2>
                            <button className="text-[14px] font-bold cursor-pointer hover:underline hover:scale-105 hover:text-white whitespace-nowrap">
                                Hiện tất cả
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-white cursor-pointer hover:underline">
                                    NAOKI
                                </div>
                                <div className="text-[14px]">Nghệ sĩ chính</div>
                            </div>
                            <button className="text-[14px] px-4 py-1 font-bold text-white cursor-pointer max-h-8 border border-[#7c7c7c] rounded-[9999px] hover:scale-[1.04] hover:border hover:border-[#fff] hover:transition duration-[50ms]">
                                Theo dõi
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <div className="text-white cursor-pointer hover:underline">
                                    Arc System Works
                                </div>
                                <div className="text-[14px]">Nghệ sĩ chính</div>
                            </div>
                            <button className="text-[14px] px-4 py-1 font-bold text-white cursor-pointer max-h-8 border border-[#7c7c7c] rounded-[9999px] hover:scale-[1.04] hover:border hover:border-[#fff] hover:transition duration-[50ms]">
                                Theo dõi
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch space-y-3 relative py-4  px-4 h-full rounded-md  dark:bg-[#1f1f1f]">
                        <div className="flex items-center h-[25px] justify-between">
                            <h2 className="font-bold text-white max-w-[235px] truncate">
                                Tiếp theo trong danh sách chờ
                            </h2>
                            <button className="text-[14px] font-bold cursor-pointer hover:underline hover:scale-105 hover:text-white whitespace-nowrap">
                                Mở danh sách chờ
                            </button>
                        </div>
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
                                    <div className="text-white cursor-pointer">
                                        The Roar of the Spark
                                    </div>
                                    <div className="text-[14px]">
                                        NAOKI, Arc System Works
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
                                        <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SidePart;

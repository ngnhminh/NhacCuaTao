import { createSignal, onCleanup, onMount } from 'solid-js';
import SidebarResizer from './SidebarResizer';
import { Plus } from 'lucide-solid';
import { isMinimalView, setIsMinimalView } from '../signal/sidebarStore.js';

const SidePartLogout = () => {
    let sidebarRef;
    const [sidebarWidth, setSidebarWidth] = createSignal('405px');

    onMount(() => {
        const observer = new ResizeObserver(() => {
            const width = sidebarRef?.offsetWidth || 0;

            if (width === 72 && !isMinimalView()) {
                setIsMinimalView(true);
            } else if (width > 72 && isMinimalView()) {
                setIsMinimalView(false);
            }
        });

        if (sidebarRef) {
            observer.observe(sidebarRef);
        }

        onCleanup(() => observer.disconnect());
    });

    return (
        <>
            <aside
                id="default-sidebar"
                ref={(el) => (sidebarRef = el)}
                style={{ width: sidebarWidth() }}
                class={`flex-none relative overflow-hidden max-w-[420px] transition-all duration-300 ease-in rounded-md`}
                aria-label="Sidenav"
            >
                <SidebarResizer
                    sidebarRef={sidebarRef}
                    setSidebarWidth={setSidebarWidth}
                />

                <div className="flex flex-col items-stretch space-y-3 relative h-full dark:bg-base-200">
                    <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <div className="group flex gap-1 cursor-pointer">
                            <span className="self-center text-md font-semibold group-hover:text-white transition-all duration-100 whitespace-nowrap dark:text-base-content">
                                Thư viện
                            </span>
                        </div>
                        <button className="btn btn-circle size-9 btn-soft btn-primary">
                            <Plus />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 pb-2 px-2">
                        <section className="flex flex-col justify-center items-start bg-[#1f1f1f] rounded-[8px] gap-5 my-2 py-4 px-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-white font-bold text-[16px]">
                                    Tạo danh sách phát đầu tiên của bạn
                                </span>
                                <span className="text-white text-[14px] font-normal">
                                    Rất dễ! Chúng tôi sẽ giúp bạn
                                </span>
                            </div>
                            <div className="self-start">
                                <button className="font-bold text-sm self-center rounded-[9999px] cursor-pointer text-center text-black bg-white px-4 py-1 leading-[2]">
                                    Tạo danh sách phát
                                </button>
                            </div>
                        </section>
                        <section className="flex flex-col justify-center items-start bg-[#1f1f1f] rounded-[8px] gap-5 my-2 py-4 px-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-white font-bold text-[16px]">
                                    Hãy cùng tìm và theo dõi một số podcast
                                </span>
                                <span className="text-white text-[14px] font-normal">
                                    Chúng tôi sẽ cập nhật cho bạn thông tin về
                                    các tập mới
                                </span>
                            </div>
                            <div className="self-start">
                                <button className="font-bold text-sm self-center rounded-[9999px] cursor-pointer text-center text-black bg-white px-4 py-1 leading-[2]">
                                    Duyệt xem podcast
                                </button>
                            </div>
                        </section>
                    </div>

                    <div className="overflow-hidden">
                        <div className="my-8 px-6 text-start leading-[2]">
                            <div className="flex flex-wrap leading-[1.7]">
                                <div className="mr-4">
                                    <a className="mb-2 text-[#b3b3b3]">
                                        <span className="text-[11px] font-normal">
                                            Pháp lý
                                        </span>
                                    </a>
                                </div>
                                <div className="mr-4">
                                    <a className="mb-2 text-[#b3b3b3]">
                                        <span className="text-[11px] font-normal">
                                            Trung tâm an toàn và quyền riêng tư
                                        </span>
                                    </a>
                                </div>
                                <div className="mr-4">
                                    <a className="mb-2 text-[#b3b3b3]">
                                        <span className="text-[11px] font-normal">
                                            Chính sách quyền riêng tư
                                        </span>
                                    </a>
                                </div>
                                <div className="mr-4">
                                    <a className="mb-2 text-[#b3b3b3]">
                                        <span className="text-[11px] font-normal">
                                            Cookie
                                        </span>
                                    </a>
                                </div>
                                <div className="mr-4">
                                    <a className="mb-2 text-[#b3b3b3]">
                                        <span className="text-[11px] font-normal">
                                            Giới thiệu Quảng cáo
                                        </span>
                                    </a>
                                </div>
                                <div className="mr-4">
                                    <a className="mb-2 text-[#b3b3b3]">
                                        <span className="text-[11px] font-normal">
                                            Hỗ trợ tiếp cận
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <a className="text-white pr-4">
                                <span className="text-[12px] font-normal">
                                    Cookie
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="mb-8 px-6">
                        <button className="py-1 px-4 gap-2 font-bold text-[14px] rounded-[9999px] cursor-pointer text-center text-white border border-[#7c7c7c] inline-flex items-center justify-center">
                            <span
                                aria-hidden="true"
                                class="e-9812-button__icon-wrapper"
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    width="16"
                                    height="16"
                                >
                                    <path d="M8.152 16H8a8 8 0 1 1 .152 0zm-.41-14.202c-.226.273-.463.713-.677 1.323-.369 1.055-.626 2.496-.687 4.129h3.547c-.06-1.633-.318-3.074-.687-4.129-.213-.61-.45-1.05-.676-1.323-.194-.235-.326-.285-.385-.296h-.044c-.055.007-.19.052-.391.296zM4.877 7.25c.062-1.771.34-3.386.773-4.624.099-.284.208-.554.329-.806a6.507 6.507 0 0 0-4.436 5.43h3.334zm-3.334 1.5a6.507 6.507 0 0 0 4.436 5.43 7.974 7.974 0 0 1-.33-.806c-.433-1.238-.71-2.853-.772-4.624H1.543zm4.835 0c.061 1.633.318 3.074.687 4.129.214.61.451 1.05.677 1.323.202.244.336.29.391.297l.044-.001c.06-.01.19-.061.385-.296.226-.273.463-.713.676-1.323.37-1.055.626-2.496.687-4.129H6.378zm5.048 0c-.061 1.771-.339 3.386-.772 4.624-.082.235-.171.46-.268.674a6.506 6.506 0 0 0 4.071-5.298h-3.03zm3.031-1.5a6.507 6.507 0 0 0-4.071-5.298c.097.214.186.44.268.674.433 1.238.711 2.853.772 4.624h3.031z"></path>
                                </svg>
                            </span>
                            Tiếng Việt
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SidePartLogout;

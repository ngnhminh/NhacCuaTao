import { createSignal, onCleanup, onMount } from 'solid-js'
import SidebarResizer from './SidebarResizer'
import { Menu } from '../../public/Icon'
import { Plus, Search, X } from 'lucide-solid'
import { highlightMatch } from './lib/utils'
import SidebarToggleButton from './SidebarToggleButton'
import { isMinimalView, setIsMinimalView } from '../signal/sidebarStore.js'

const artists = [
    {
        name: 'Đạt G',
        img: 'https://i.scdn.co/image/ab6761610000101febc4b709c643e32f7bcc5a8d',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Mr.Siro',
        img: 'https://i.scdn.co/image/ab6761610000101f4371fb198b011bb666a3bfde',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Đen',
        img: 'https://i.scdn.co/image/ab6761610000101f91d2d39877c13427a2651af5',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Sol7',
        img: 'https://i.scdn.co/image/ab6761610000101fcc911aa2866d62f7bd5e5894',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Ngơ',
        img: 'https://i.scdn.co/image/ab6761610000101f6994e627c5b26909bc8ba813',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Binz',
        img: 'https://i.scdn.co/image/ab6761610000101fc1e37930853ff1686dcdd567',
        date: '16 thg 6, 2024',
    },
    {
        name: 'W/N',
        img: 'https://i.scdn.co/image/ab6761610000101f316c0f0bc6cf3a29c203ab1e',
        date: '16 thg 6, 2024',
    },
    {
        name: 'Sơn Tùng M-TP',
        img: 'https://i.scdn.co/image/ab6761610000101f5a79a6ca8c60e4ec1440be53',
        date: '16 thg 6, 2024',
    },
]

const SidePart = () => {
    let sidebarRef
    const [sidebarWidth, setSidebarWidth] = createSignal('405px')
    const [isNarrow, setIsNarrow] = createSignal(false)
    const [searchField, setSearchField] = createSignal(false)
    const [select, setSelect] = createSignal(true)
    const [searchQuery, setSearchQuery] = createSignal('')

    const toggleSidebar = () => {
        const currentWidth = sidebarRef?.offsetWidth || 0

        if (currentWidth > 72) {
            setSidebarWidth('72px')
        } else {
            setSidebarWidth('350px')
        }
    }

    onMount(() => {
        const observer = new ResizeObserver(() => {
            const width = sidebarRef?.offsetWidth || 0

            setIsNarrow(width <= 420)

            if (width === 72 && !isMinimalView()) {
                setIsMinimalView(true)
            } else if (width > 72 && isMinimalView()) {
                setIsMinimalView(false)
            }
        })

        if (sidebarRef) {
            observer.observe(sidebarRef)
        }

        onCleanup(() => observer.disconnect())
    })

    // Lọc danh sách nghệ sĩ dựa trên giá trị tìm kiếm
    const filteredArtists = () => {
        const query = searchQuery().toLowerCase()
        return artists.filter((artist) =>
            artist.name.toLowerCase().includes(query)
        )
    }

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

                <div
                    className={`flex flex-col items-stretch space-y-3 relative py-4  ${
                        isMinimalView() ? 'px-1' : 'px-4'
                    } h-full  dark:bg-base-200 `}
                >
                    <div
                        className={`flex items-center justify-between ${
                            isMinimalView() ? 'flex-col gap-3 items-center' : ''
                        }`}
                    >
                        <div className="group flex gap-1 cursor-pointer">
                            <SidebarToggleButton onClick={toggleSidebar} />

                            {!isMinimalView() && (
                                <span className="self-center text-md font-semibold group-hover:text-white transition-all duration-100 whitespace-nowrap dark:text-base-content">
                                    Thư viện
                                </span>
                            )}
                        </div>
                        <button className="btn btn-circle size-9 btn-soft btn-primary">
                            <Plus />
                        </button>
                    </div>

                    {isMinimalView() ? (
                        // Chế độ hiển thị tối giản
                        <div
                            class="text-base-content whitespace-nowrap scrollbar pt-8 overflow-auto
            [&::-webkit-scrollbar]:w-8"
                        >
                            <For each={artists}>
                                {(artist) => (
                                    <div class="flex items-center hover:bg-base-100 cursor-pointer justify-center rounded-lg box-content p-2">
                                        <img
                                            src={artist.img}
                                            alt={artist.name}
                                            class="size-12 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                            </For>
                        </div>
                    ) : (
                        <>
                            <div
                                class={`flex justify-between shrink-0 ${
                                    isNarrow() ? 'flex-col gap-2' : 'gap-1'
                                }`}
                            >
                                <div className="flex gap-2 items-center ">
                                    <button
                                        className={`btn btn-circle size-9 btn-soft btn-primary transition-all ease-initial duration-200 ${
                                            select() ? '' : 'w-0 opacity-0'
                                        }`}
                                        onClick={() => setSelect(false)}
                                    >
                                        <X />
                                    </button>

                                    <button
                                        className={`btn ${
                                            select()
                                                ? 'text-primary-content bg-neutral-content'
                                                : 'btn-soft'
                                        } transition-all duration-150 h-9  hover:scale-102 `}
                                        onClick={() => setSelect(true)}
                                    >
                                        Nghệ sĩ
                                    </button>
                                </div>

                                <div
                                    className={`flex flex-1 justify-between items-center ${
                                        isNarrow() ? '' : ' justify-end'
                                    } `}
                                >
                                    <label
                                        className={`input w-fit transition-all duration-300 ease-out ${
                                            searchField()
                                                ? 'bg-base-100'
                                                : 'bg-transparent'
                                        } ${
                                            isNarrow() ? '' : 'flex-row-reverse'
                                        } hover:bg-base-100 cursor-pointer gap-0 border-none  !outline-none`}
                                    >
                                        <button
                                            onClick={() =>
                                                setSearchField(!searchField())
                                            }
                                            className=" "
                                        >
                                            <Search size={16} />
                                        </button>
                                        <input
                                            type="search"
                                            value={searchQuery()}
                                            onInput={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className={`ring-0 p-0 ease-out m-0 placeholder:text-base-content transition-all duration-100 ${
                                                searchField()
                                                    ? 'w-full ml-2 pl-2'
                                                    : 'w-0 opacity-0'
                                            } `}
                                            required
                                            placeholder="Tìm kiếm tại Thư viện"
                                        />
                                    </label>
                                    <button className="p-0 btn btn-ghost hover:bg-transparent border-none hover:scale-108 transition-all duration-100">
                                        Gần đây
                                        <Menu />
                                    </button>
                                </div>
                            </div>

                            {!isNarrow() && (
                                <div className="grid grid-cols-3 font-semibold text-xs whitespace-nowrap border-b border-base-100 pb-2 mb-2 text-base-content">
                                    <div>Tiêu đề</div>
                                    <div className="flex justify-center">
                                        Đã thêm Ngày
                                    </div>
                                    <div className="flex flex-row-reverse">
                                        Đã phát
                                    </div>
                                </div>
                            )}

                            <div class="text-base-content whitespace-nowrap -ml-2 scrollbar overflow-auto">
                                <For each={filteredArtists()}>
                                    {(artist) => (
                                        <div
                                            class={`grid ${
                                                isNarrow()
                                                    ? 'grid-cols-1'
                                                    : 'grid-cols-3'
                                            } items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-base-100 transition`}
                                        >
                                            <div class="flex items-center space-x-3">
                                                <img
                                                    src={artist.img}
                                                    alt={artist.name}
                                                    class="size-12 rounded-full object-cover"
                                                />
                                                <span class="line-clamp-1">
                                                    {highlightMatch(
                                                        artist.name,
                                                        searchQuery()
                                                    )}
                                                </span>
                                            </div>
                                            {!isNarrow() && (
                                                <div className="flex justify-center text-sm items-center">
                                                    {artist.date}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </For>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    )
}

export default SidePart

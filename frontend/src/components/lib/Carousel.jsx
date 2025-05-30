import { createSignal, onMount, onCleanup } from 'solid-js'
import { ChevronLeft, ChevronRight } from 'lucide-solid'
import { useAuth } from "../../layout/AuthContext";
import {setShouldReloadHistory} from "../../stores/homeStore";
import { addToHistoryService } from "../../../services/authService";

const Carousel = (props) => {
    const itemWidth = props.itemWidth || 168 + 20 // Độ rộng item + khoảng cách giữa các item
    const [currentPage, setCurrentPage] = createSignal(0)
    const [itemsPerPage, setItemsPerPage] = createSignal(4)
    let containerRef
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const auth = useAuth();

    // Tính số item hiển thị dựa vào chiều rộng container
    const updateItemsPerPage = () => {
        if (containerRef) {
            const width = containerRef.clientWidth
            const count = Math.floor(width / itemWidth)
            setItemsPerPage(count)
        }
    }

    onMount(() => {
        const observer = new ResizeObserver(() => {
            updateItemsPerPage()
        })

        if (containerRef) {
            observer.observe(containerRef)
            updateItemsPerPage() // Gọi 1 lần ban đầu
        }

        onCleanup(() => observer.disconnect())
    })

    const maxPage = () => Math.ceil(props.items.length / itemsPerPage()) - 1

    const prev = () => setCurrentPage((p) => Math.max(p - 1, 0))
    const next = () => setCurrentPage((p) => Math.min(p + 1, maxPage()))

    const translateX = () => `-${currentPage() * itemWidth * itemsPerPage()}px`

    const addToHistory = async(song) => {
        await addToHistoryService(song);
    }

    const playSong = (song) => {
        auth.setCurrentSong(song);
        addToHistory(song);
        setShouldReloadHistory(true);
    };

    return (
        <div class="relative pl-1" ref={containerRef}>
            {/* Buttons */}
            <div class="absolute inset-0 flex items-center justify-between px-4">
                <button
                    onClick={prev}
                    class={`btn btn-circle btn-primary btn-soft z-10 ${
                        currentPage() === 0 ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={next}
                    class={`btn btn-circle btn-primary btn-soft z-10 ${
                        currentPage() < maxPage() ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <ChevronRight />
                </button>
            </div>

            {/* Items */}
            <div class="overflow-hidden">
                <div
                    class="flex gap-2 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(${translateX()})` }}
                >
                    {props.items.map((item) => (
                        <div
                            key={item.id}
                            class="card rounded-md hover:bg-base-100 transition-all duration-300 group cursor-pointer p-3 box-content w-[168px] flex-shrink-0 "
                            onClick={() => playSong(item)}
                        >
                            <figure className="relative  mb-3">
                                <img
                                    src={`${backendUrl}${item.picture_url}`}
                                    alt={item.song_name || ''}
                                    class="w-full"
                                />
                                <div
                                    className="card-actions pr-3 pb-3 absolute right-0 bottom-0 
                                translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                                transition-all duration-300 ease-out"
                                >
                                    <button className="btn btn-primary flex shadow-sm size-[48px] p-auto btn-circle hover:scale-110 hover:brightness-110 transiton-all duration-400 ease-in-out">
                                        <svg
                                            class="size-8"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M6 4l10 6-10 6V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </figure>

                            <div>
                                <h3 class="text-white font-bold truncate">{item.song_name}</h3>
                                <h3 class="text-sm text-gray-300 line-clamp-1 break-words">
                                    {item.artist.artist_name}
                                    {Array.isArray(item.artists)
                                    ? item.artists.map((artist, index) => (
                                        <>
                                            <a
                                            href={`/artist/${encodeURIComponent(artist.name)}`}
                                            class="hover:underline"
                                            >
                                            , {artist.artist_name}
                                            </a>
                                            {index < item.artists.length - 2 && <span>, </span>}
                                            {index === item.artists.length - 2 && <span> và </span>}
                                        </>
                                        ))
                                    : item.artist?.artist_name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Carousel

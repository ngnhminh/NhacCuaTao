import { createSignal, onMount, onCleanup } from 'solid-js'
import { ChevronLeft, ChevronRight } from 'lucide-solid'
import { useNavigate } from "@solidjs/router";

const CarouselForArtist = (props) => {
    const itemWidth = props.itemWidth || 168 + 20 // Độ rộng item + khoảng cách giữa các item
    const [currentPage, setCurrentPage] = createSignal(0)
    const [itemsPerPage, setItemsPerPage] = createSignal(4)
    let containerRef
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

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

    const handleOpenArtist = (id) => {
        navigate(`/artist/${id}`)
    }
    
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
                            class="flex flex-col items-center text-center cursor-pointer w-[168px] flex-shrink-0 p-3 hover:bg-base-100 rounded-lg transition-all duration-300 group"
                            onClick = {() => handleOpenArtist(item.id)}
                        >
                            <div class="w-32 h-32 mb-3">
                            <img
                                src={`${backendUrl}${item.user.avatar_url}`}
                                alt={item.name || ''}
                                class="w-full h-full object-cover rounded-full"
                            />
                            </div>
                            <h3 class="text-white font-semibold truncate w-full">{item.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CarouselForArtist

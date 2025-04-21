import MainSection from '../components/sections/MainSection'
import Navigation from '../components/sections/Navigation'
import SidePart from '../components/SidePart'
import Footer from '../layout/Footer'
import { createSignal, onCleanup, onMount } from 'solid-js'

const items = [
    {
        name: '9Hz 99Hz 999Hz Infinite Healing Golden WaveㅣVibration of 5 Dimension Frequency',
        img: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da849933214dfb18e7f4bd68e56d',
    },
    {
        name: 'White Noise 10 Hours',
        img: 'https://i.scdn.co/image/ab67706f000000025b4d326fee8531fe32efe166',
    },
    {
        name: 'Nhạc Ru Ngủ Cho Người Mất Ngủ, Dễ ngủ, Giảm Stress',
        img: 'https://mosaic.scdn.co/640/ab67616d00001e0219266a6ed2ebd0fe643ac723ab67616d00001e026f51023755dbf3e9db1215f5ab67616d00001e029b3fb224d88f6914e083ebb7ab67616d00001e02b585ba1ee2b7cfa56185520b',
    },
    {
        name: 'Tiếng Ồn Trắng',
        img: 'https://mosaic.scdn.co/640/ab67616d00001e0206013115ced3cd702e75a844ab67616d00001e0209848e952392cd4a18c5b29fab67616d00001e02ceec45d05413f26e152fb547ab67616d00001e02e34429d776708f87460cd97e',
    },
]
const Home = () => {
    let containerRef
    let scrollContainer
    const [scrolled, setScrolled] = createSignal(false)

    const [imgSize, setImgSize] = createSignal(64)
    const [gridCols, setGridCols] = createSignal('grid-cols-4')
    const [scalebtn, setScalebtn] = createSignal()
    const [scaletxt, setScaletxt] = createSignal()

    onMount(() => {
        const handleScroll = () => {
            setScrolled(scrollContainer.scrollTop > 74)
        }

        scrollContainer.addEventListener('scroll', handleScroll)
        handleScroll() // kiểm tra ban đầu

        onCleanup(() => {
            scrollContainer.removeEventListener('scroll', handleScroll)
        })
    })

    onMount(() => {
        const observer = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width
            if (width >= 1024) {
                setImgSize(64)
                setGridCols('grid-cols-4')
                setScalebtn('scale-100')
                setScaletxt('scale-100')
            } else {
                setImgSize(48)
                setGridCols('grid-cols-4')
                setScalebtn('scale-80')
                setScaletxt('scale-95')
            }
        })

        observer.observe(containerRef)

        onCleanup(() => observer.disconnect())
    })
    return (
        <div className="flex h-[calc(100vh-64px-72px)] gap-3 p-2 overflow-hidden w-full bg-base-300">
            <SidePart />
            <div
                ref={scrollContainer}
                className={`w-full rounded-md overflow-y-auto ease-linear transition-colors duration-400 ${
                    scrolled()
                        ? 'bg-base-200'
                        : 'bg-gradient-to-b from-amber-900/45 to-base-200 '
                } `}
            >
                <Navigation scrolled={scrolled} />
                <div
                    className={`grid ${gridCols()} px-10 mb-4 gap-3`}
                    ref={containerRef}
                >
                    {items.map((item) => (
                        <div className="card card-side w-[250px] overflow-hidden rounded-md bg-white/10 hover:bg-white/20 group shadow-md">
                            <img
                                style={{
                                    width: `${imgSize()}px`,
                                    height: 'auto',
                                }}
                                class="transition-all duration-300 object-contain"
                                src={item.img}
                                alt={item.name}
                            />
                            <div className="card-body cursor-pointer group-hover:brightness-130 transition-all duration-200 flex-row p-0 w-full items-center relative">
                                <h2
                                    className={`text-sm card-title w-full pl-3 line-clamp-2 ${scaletxt()} `}
                                >
                                    {item.name}
                                </h2>
                                <div className="card-actions pr-3 opacity-0 group-hover:opacity-100 hover:scale-105 hover:brightness-120 transition-all duration-200 ">
                                    <button
                                        className={`btn btn-primary flex shadow-sm size-[48px] p-auto btn-circle ${scalebtn()} `}
                                    >
                                        <svg
                                            class="size-8"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M6 4l10 6-10 6V4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pb-15">
                    <MainSection />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Home

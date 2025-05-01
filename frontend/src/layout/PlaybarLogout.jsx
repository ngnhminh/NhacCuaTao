// components/PlaybarLogout.tsx
export default function PlaybarLogout() {
    const handleClick = () => {
        window.location.href = '/register';
    };

    return (
        <div
            onClick={handleClick}
            style={
                'background-image: linear-gradient(90deg, #af2896, #509bf5);'
            }
            className="flex items-center justify-between pt-[11px] pb-[7px] pr-6 pl-[15px] cursor-pointer gap-6"
        >
            <div className="text-white mb-1 leading-5">
                <p className="font-bold text-[14px]">Xem trước Spotify</p>
                <p className="text-[16px]">
                    Đăng ký để nghe không giới hạn các bài hát và podcast với
                    quảng cáo không thường xuyên. Không cần thẻ tín dụng.
                </p>
            </div>
            <button className="px-8 py-2 font-bold cursor-pointer bg-white text-black rounded-2xl leading-8">
                Đăng kí miễn phí
            </button>
        </div>
    );
}

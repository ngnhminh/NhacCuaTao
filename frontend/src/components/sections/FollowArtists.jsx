const FollowArtists = ({ img, name, title }) => {
    return (
        <div className="p-3 cursor-pointer hover:bg-[#1f1f1f] rounded-[6px] group">
            <div className="flex justify-center relative">
                <img
                    className="rounded-[50%] bg-[#333] [box-shadow:0_8px_24px_rgba(0,0,0,0.5)] object-cover"
                    src={img}
                />
                <button className="absolute bg-[#1ed760] text-black rounded-[9999px] w-12 h-12 bottom-2.5 right-2.5 items-center justify-center cursor-pointer hover:bg-[#3be477] hover:scale-[1.04] hidden group-hover:flex">
                    <span className="">
                        <span className="">
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                className="w-6 h-6 fill-current"
                            >
                                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                            </svg>
                        </span>
                    </span>
                </button>
            </div>
            <div className="mt-2 flex flex-col gap-1">
                <a
                    href="/artist"
                    className="text-[1rem] hover:underline capitalize"
                >
                    {name}
                </a>
                <div className="text-sm text-[#b3b3b3]">{title}</div>
            </div>
        </div>
    );
};

export default FollowArtists;

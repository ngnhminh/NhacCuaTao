const AlbumCard = ({ imgSrc, title, year }) => (
    <div className="inline-flex flex-col gap-2 rounded-md p-3 cursor-pointer hover:bg-[#1f1f1f] relative group">
        <div className="relative rounded-md shadow-2xl">
            <img src={imgSrc} alt={title} />
            <button className="bg-[#1ed760] hover:bg-[#3be477] p-2 rounded-full absolute bottom-2 right-2 cursor-pointer hover:scale-[1.02] hidden group-hover:block transition-all duration-300 ease-in-out">
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-black"
                >
                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                </svg>
            </button>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 items-start">
                <a className="cursor-pointer text-base font-normal hover:underline capitalize">
                    {title}
                </a>
                <div className="text-[#b3b3b3] text-sm font-normal">{year}</div>
            </div>
        </div>
    </div>
);

export default AlbumCard;

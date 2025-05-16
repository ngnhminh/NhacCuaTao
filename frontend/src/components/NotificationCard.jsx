import { useNavigate } from "@solidjs/router";
import { useAuth } from '../layout/AuthContext';
import { formatDateTime } from '../../utils/formatDate';

const NotificationCard = ({ description, time, img, status, artist, user }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const auth = useAuth();

    return(
        <Show when={auth.isArtist()}
            fallback={
                <>
                    <li
                        class={`flex items-center justify-between px-4 py-3 cursor-pointer 
                            ${status === 0 
                            ? "bg-gray-50 dark:bg-gray-800 opacity-90 hover:bg-gray-100 dark:hover:bg-gray-700" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    >
                        <div class="flex items-center space-x-3">
                            <img src={`${backendUrl}${artist.avatar_url}`} alt="avatar" class="w-10 h-10 rounded-full"/>
                            <div>
                            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                                <span class="font-semibold">Ca sĩ {artist.artist_name} {description}</span>
                            </p>
                            <p class="text-xs text-gray-500">{formatDateTime(time)}</p>
                            </div>
                        </div>
                        <img src={`${backendUrl}${img}`} alt="thumb" class="w-16 h-10 object-cover rounded"/>
                    </li>
                </>
            }
        >
            <>
                <li
                    class={`flex items-center justify-between px-4 py-3 cursor-pointer 
                        ${status === 0 
                        ? "bg-gray-50 dark:bg-gray-800 opacity-90 hover:bg-gray-100 dark:hover:bg-gray-700" 
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                    <div class="flex items-center space-x-3">
                        <img src={`${backendUrl}${user.avatar_url}`} alt="avatar" class="w-10 h-10 rounded-full"/>
                        <div>
                        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                            <span class="font-semibold">Người dùng {user.full_name} {description}</span>
                        </p>
                        <p class="text-xs text-gray-500">{formatDateTime(time)}</p>
                        </div>
                    </div>
                </li>
            </>
        </Show>
    )
};

export default NotificationCard;

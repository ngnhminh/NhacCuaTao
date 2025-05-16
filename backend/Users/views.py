from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from .models import User
from Artists.models import Artist
from ArtistFollow.models import ArtistFollow
from AuthToken.models import AuthToken
from SongInPlaylist.models import SongInPlaylist
from Playlists.models import Playlist
from Requests.models import ArtistRequest
from FavoriteSongs.models import FavoriteSongs
from History.models import History
from Notification.models import Notification
from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
from django.core.files.storage import default_storage
from django.conf import settings
from Artists.models import Artist
from bson import ObjectId
# Create your views here.

class LoginView(APIView):
    def post(self, request):
        try:
            data = request.data
            email = data.get("email")
            password = data.get("password")
            user = User.objects.get(email=email)
            
            if check_password(password, user.password):
                token = str(uuid.uuid4())
                
                response_data = {
                    "token": token,
                    "user_id": str(user.id),
                    "fullname": user.full_name,
                    "email": user.email,
                    "avatar_url": user.avatar_url
                }

                if user.status == 0:
                    return JsonResponse({"status": 0})
                
                artist = Artist.objects.filter(user=user).first()

                if artist:
                    artist_token = str(uuid.uuid4())
                    response_data["artist_id"] = str(artist.id)
                    response_data["artist_token"] = artist_token
                    response_data["artist_name"] = artist.artist_name
                    AuthToken.objects.create(user=user, token=token, artist=artist)
                else:
                    AuthToken.objects.create(user=user, token=token)
                    
                return JsonResponse(response_data)
            else:
                return JsonResponse({"error": "Invalid password"}, status=401)

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

class RegisterView(APIView):
    def post(self, request):
        try:
            data = request.data
            email = data.get("email")
            password = data.get("password")
            full_name = data.get("full_name")
            avatar_url =  data.get("avatar_url")
            
            if User.objects.filter(email=email).count() > 0:
                return JsonResponse({"exists": True}, status=200)

            hashed_password = make_password(password)

            user = User.objects.create(
                email=email,
                password=hashed_password,
                full_name=full_name,
                avatar_url = avatar_url,
                status=1,
            )

            return JsonResponse({"created": True, "user_id": str(user.id)}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

# class PrivateView(APIView):
#     permission_classes = [IsAuthenticated]  # API yêu cầu xác thực

#     def get(self, request):
#         return Response({"message": "Đây là API yêu cầu xác thực"})

# const token = localStorage.getItem("userToken");

# axios.get(`${API_URL}/api/protected-data/`, {
#   headers: {
#     Authorization: `Token ${token}`
#   }
# });

class LogoutView(APIView):
    def post(self, request):
        # Lấy token từ header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(' ')[1]  # Lấy token sau "Token "
            if token:
                # Xóa token khỏi cơ sở dữ liệu
                AuthToken.objects.filter(token=token).delete()
                return Response({"message": "Logged out successfully"}, status=200)
        return Response({"error": "Token missing or invalid"}, status=400)
    
class OrtherActionView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getUserInfo":
                auth_header = request.headers.get('Authorization')
                if auth_header:
                    token = auth_header.split(' ')[1]
                    if token:
                        auth_token = AuthToken.objects.filter(token=token).first()
                        if auth_token:
                            user = auth_token.user
                            artist = Artist.objects.filter(user=user).first()
                            user_data = {
                                "full_name": user.full_name,
                                "email": user.email,
                                "avatar_url": user.avatar_url
                            }
                            if artist:
                                return JsonResponse({
                                    "is_artist": True,
                                    "artist": {
                                        "id": str(artist.id),
                                        "artist_name": artist.artist_name,
                                        "description": artist.description,
                                        "country": artist.country,
                                        "followers": artist.followers,
                                    },
                                    "user": user_data
                                }, status = 200)
                            else:
                                return JsonResponse({
                                    "is_artist": False,
                                    "artist": None,
                                    "user": user_data
                                })
                return Response({"error": "Token missing or invalid"}, status=400) 
            # For admin
            if action == "getAllUser":
                # Lấy toàn bộ user_id đã được dùng trong bảng Artist
                artist_user_ids = set(str(artist.user.id) for artist in Artist.objects if artist.user)

                # Lọc các user không có trong danh sách artist_user_ids
                listUser = User.objects(id__nin=artist_user_ids)

                users_data = [
                    {
                        "id": str(user.id),
                        "full_name": user.full_name,
                        "email": user.email,
                        "avatar_url": user.avatar_url,
                        "status": user.status
                    }
                    for user in listUser
                ]
                return JsonResponse({"users": users_data}, status=200)

            return JsonResponse({"mess": "Param wrong"}, status=404)

   
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    def post(self, request):
        try:
            action = request.POST.get("action")
            if action == "uploadAvatar":
                auth_header = request.headers.get('Authorization')
                if auth_header:
                    token = auth_header.split(' ')[1]
                    if token:
                        auth_token = AuthToken.objects.filter(token=token).first()
                        if auth_token:
                            user = auth_token.user
                            avatar_file = request.FILES.get('avatar')

                            if not avatar_file:
                                return JsonResponse({"error": "No file uploaded"}, status=400)

                            # Lưu file vào thư mục media
                            filename = f"avatars/{user.id}_{avatar_file.name}"
                            path = default_storage.save(filename, avatar_file)

                            # Cập nhật URL của ảnh trong cơ sở dữ liệu
                            user.avatar_url = default_storage.url(path)
                            user.save()

                            return JsonResponse({"avatarUrl": user.avatar_url})
                        return JsonResponse({"error": "Unauthorized"}, status=401)
                    
            action = request.data.get("action")      
            if action == "unlockUser":
                userId = request.data.get("id")
                user = User.objects.get(id=ObjectId(userId))
                user.update(set__status=1)
                return JsonResponse({"status": True}, status=200)
            
            if action == "lockUser":
                userId = request.data.get("id")
                user = User.objects.get(id=ObjectId(userId))
                user.update(set__status=0)
                return JsonResponse({"status": True}, status=200)
            return JsonResponse({"mess": "WrongParams"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

class UserDeleteView(APIView):
    def delete(self, request, id):
        try:
            user = User.objects.get(id=ObjectId(id))
            ArtistFollow.objects.filter(user=user).delete()
            ArtistRequest.objects.filter(user=user).delete()
            AuthToken.objects.filter(user=user).delete()
            FavoriteSongs.objects.filter(user=user).delete()
            History.objects.filter(user=user).delete()
            Notification.objects.filter(user=user).delete()
            
            # Lấy toàn playlist
            playlists = Playlist.objects.filter(user=user)
            SongInPlaylist.objects.filter(playlist__in=playlists).delete()
            playlists.delete()
            
            user.delete()
            return JsonResponse({"message": "Xóa thành công", "removed": True}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
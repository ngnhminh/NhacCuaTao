from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from django.http import JsonResponse
from .models import FavoriteSongs
from Songs.models import Song
from Users.models import User
from AuthToken.models import AuthToken
from bson import ObjectId
from mongoengine.errors import DoesNotExist, ValidationError
from bson.errors import InvalidId
from django.core.exceptions import ObjectDoesNotExist
from ArtistOfSong.models import ArtistOfSong

class FavoriteSongGetView(APIView):
   def get(self, request):
       try:
            action = request.GET.get('action')
            if action == "findSongInFavoriteSong":
                songId = request.GET.get("songId")
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()
                    if auth_token:
                        song = Song.objects.get(id=ObjectId(songId))
                        user = auth_token.user
                        count = FavoriteSongs.objects.filter(song=song, user=user).count() > 0
                        if count > 0:
                            is_existed = True
                        else:
                            is_existed = False
                        return JsonResponse({
                                "is_existed": is_existed,
                            }, status=201)
                    return JsonResponse({"error": "Unauthorized"}, status=401)
                
            if action == "getAllFavoriteSongIds":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        fav_song_list = FavoriteSongs.objects(user=user).select_related()

                        song_ids = [fs.song.id for fs in fav_song_list]

                        # Truy tất cả các ArtistOfSong liên quan
                        artist_of_song_list = ArtistOfSong.objects(song__in=song_ids).select_related()

                        # Tạo dict ánh xạ song_id -> list nghệ sĩ
                        artists_data = {
                            aos.song.id: [
                                {"id": str(artist.id), "artist_name": artist.artist_name}
                                for artist in aos.artists
                            ]
                            for aos in artist_of_song_list
                        }

                        fav_songs_data = [
                            {
                                "song_id": str(fs.song.id),
                                "song_name": fs.song.song_name,
                                "duration": fs.song.duration,
                                "song_url": fs.song.song_url,
                                "picture_url": fs.song.picture_url,
                                "listion_count": fs.song.listen_count,
                                "artists": artists_data.get(fs.song.id, []),
                                "artist": {
                                    "artist_name": fs.song.artist.artist_name if fs.song.artist else ""
                                }
                            }
                            for fs in fav_song_list
                        ]
                        return JsonResponse({"songList": fav_songs_data}, status=201)
                    return JsonResponse({"error": "Unauthorized"}, status=401)
                
            if action == "getFavListInform":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        favlistInform_data = {
                                "full_name": str(user.full_name),
                                "avatar_url": user.avatar_url,
                                "song_number": FavoriteSongs.objects.filter(user=user).count(),
                                "songs_duration": sum([sip.song.duration for sip in FavoriteSongs.objects.filter(user=user)])
                            }
                        return JsonResponse({"favoriteListInform": favlistInform_data}, status=201)
                return JsonResponse({"error": "Unauthorized"}, status=401)
       except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
class FavoriteSongPostView(APIView):
    def post(self, request):
        try:
            data = request.data
            action = data.get("action")
            
            if action == "likedSong":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        songId = data.get("songId")
                        song = Song.objects.get(id=ObjectId(songId))
                        FavoriteSongs.objects.create(user=user, song=song)
                        return JsonResponse({"created": True}, status=201)

                    return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "Invalid action"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
class FavoriteSongDeleteView(APIView):
    def delete(self, request, id):
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith("Token "):
                token = auth_header.split(' ')[1]
                auth_token = AuthToken.objects.filter(token=token).first()

                if auth_token:
                    user = auth_token.user
                    song = Song.objects.get(id=ObjectId(id))
                    unlike_song = FavoriteSongs.objects.get(user=user, song=song)
                    if not unlike_song:
                        return JsonResponse({"error": "Bài hát không nằm trong danh sách yêu thích"}, status=404)
                    unlike_song.delete()
                    return JsonResponse({"message": "Xóa thành công", "removed": True}, status=200)
                return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "No Authoriztion"}, status=401)
        except (ObjectDoesNotExist, InvalidId):
            return JsonResponse({"error": "Không tìm thấy hoặc ID không hợp lệ"}, status=404)
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
                        favSongList = FavoriteSongs.objects.filter(user=user)
                        
                        fav_songs_data = [
                            {
                                "song_id": str(data.song.id),
                            }
                            for data in favSongList
                        ]
                        
                        return JsonResponse({
                                "songList": fav_songs_data,
                            }, status=201)
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
            song = Song.objects.get(id=ObjectId(id))
            unlike_song = FavoriteSongs.objects.filter(song=song).first()
            if not unlike_song:
                return JsonResponse({"error": "Bài hát không nằm trong danh sách yêu thích"}, status=404)
            unlike_song.delete()
            return JsonResponse({"message": "Xóa thành công", "removed": True}, status=200)
        except (ObjectDoesNotExist, InvalidId):
            return JsonResponse({"error": "Không tìm thấy hoặc ID không hợp lệ"}, status=404)

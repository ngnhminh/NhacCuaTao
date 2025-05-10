from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import SongInPlaylist
from Songs.models import Song
from Playlists.models import Playlist
from AuthToken.models import AuthToken
from bson import ObjectId

class SongInPlaylistPostView(APIView):
    def post(self, request):
        try:
            print("Content-Type:", request.content_type)
            print("Request body:", request.body)
            print("Parsed data:", request.data)

            action = request.data.get("action")
            print("action", action)
            if action != "addSongInPlaylist":
                return JsonResponse({"error": "Action không hợp lệ"}, status=400)

            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith("Token "):
                return JsonResponse({"error": "Thiếu token"}, status=401)

            token = auth_header.split(' ')[1]
            auth_token = AuthToken.objects.filter(token=token).first()
            if not auth_token:
                return JsonResponse({"error": "Token không hợp lệ"}, status=401)

            songId = request.data.get("songId")
            playlistId = request.data.get("playlistId")
            if not songId or not playlistId:
                return JsonResponse({"error": "Thiếu songId hoặc playlistId"}, status=400)

            song = Song.objects.filter(id=ObjectId(songId)).first()
            if not song:
                return JsonResponse({"error": "Không tìm thấy bài hát"}, status=404)

            playlist = Playlist.objects.filter(id=ObjectId(playlistId)).first()
            if not playlist:
                return JsonResponse({"error": "Không tìm thấy playlist"}, status=404)

            if SongInPlaylist.objects.filter(song=song, playlist=playlist).count() > 0:
                return JsonResponse({"created": False, "message": "Đã có trong playlist"}, status=200)

            SongInPlaylist.objects.create(song=song, playlist=playlist)
            return JsonResponse({"created": True}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

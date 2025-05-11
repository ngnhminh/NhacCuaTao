from django.shortcuts import render
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from .models import Playlist
from SongInPlaylist.models import SongInPlaylist
from django.http import JsonResponse
from bson import ObjectId

# Create your views here.
class PlaylistPostView(APIView):
    def post(self, request):
        try:
            action = request.data.get("action")
            if action == "createPlaylist":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()
                    
                    if auth_token:
                        user = auth_token.user
                        new_playlist = Playlist.objects.create(
                            playlist_name="My PlayList",
                            user=user,
                            playlist_picture = "/media/playlistsImg/OIP.jpg",
                        )
                        return JsonResponse({
                            "created": True,
                            "newPlaylistid": str(new_playlist.id)
                        }, status=201)
                return JsonResponse({"error": "Unauthorized"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class PlaylistGetView(APIView):
   def get(self, request):
       try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith("Token "):
                token = auth_header.split(' ')[1]
                auth_token = AuthToken.objects.filter(token=token).first()

                if auth_token:
                    action = request.GET.get('action')
                    if action == "getAllPlaylistIds":
                        user = auth_token.user
                        playlistList = Playlist.objects.filter(user=user)
                        
                        playlist_data = [
                            {
                                "id": str(data.id),
                                "playlist_name": data.playlist_name,
                                "playlist_picture": data.playlist_picture,
                                "song_ids": [
                                    str(song.song.id) for song in SongInPlaylist.objects.filter(playlist=data)
                                ]
                            }
                            for data in playlistList
                        ]
                        return JsonResponse({
                                "playlistList": playlist_data,
                            }, status=201)
                            
                    # Trả về thông tin playlist
                    if action == "getPlaylistInform":
                        playlistId = request.GET.get("playlistId")
                        
                        if not playlistId:
                            return JsonResponse({"error": "Thiếu playlistId"}, status=400)
                        
                        playlist = Playlist.objects.get(id=ObjectId(playlistId))
                        
                        if not playlist:
                            return JsonResponse({"error": "Không tìm thấy playlist"}, status=404)
                        
                        user = auth_token.user
                        playlist_data = {
                            "id": str(playlist.id),
                            "playlist_name": playlist.playlist_name,
                            "playlist_picture": playlist.playlist_picture,
                            "user": {
                                "id": str(playlist.user.id),
                                "full_name": user.full_name,
                                "avatar_url": user.avatar_url,
                            },
                            "song_number": SongInPlaylist.objects.filter(playlist=playlist).count(),
                            "songs_duration": sum([sip.song.duration for sip in SongInPlaylist.objects.filter(playlist=playlist)])
                        }
                        return JsonResponse({"playlistDetail": playlist_data}, status=200)
                
       except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
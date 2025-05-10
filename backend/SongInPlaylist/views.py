from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import SongInPlaylist
from Songs.models import Song
from ArtistOfSong.models import ArtistOfSong
from Artists.models import Artist
from Playlists.models import Playlist
from AuthToken.models import AuthToken
from bson import ObjectId

class SongInPlaylistPostView(APIView):
    def post(self, request):
        try:
            # print("Content-Type:", request.content_type)
            # print("Request body:", request.body)
            # print("Parsed data:", request.data)

            action = request.data.get("action")
            print("action", action)
            if action == "addSongInPlaylist":
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

class SongInPlaylistGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get("action")
            if action == "getSongsInPlaylistIds":
                auth_header = request.headers.get('Authorization')
                if not auth_header or not auth_header.startswith("Token "):
                    return JsonResponse({"error": "Thiếu token"}, status=401)

                token = auth_header.split(' ')[1]
                auth_token = AuthToken.objects.filter(token=token).first()
                if not auth_token:
                    return JsonResponse({"error": "Token không hợp lệ"}, status=401)
                
                playlistId = request.GET.get("playlistId")
                
                if not playlistId:
                    return JsonResponse({"error": "Thiếu playlistId"}, status=400)
                
                playlist = Playlist.objects.filter(id=ObjectId(playlistId)).first()
                if not playlist:
                    return JsonResponse({"error": "Không tìm thấy playlist"}, status=404)

                playlist_data = SongInPlaylist.objects.filter(playlist=playlist)
            
                #Lấy tất cả song trong playlist
                list_song = [data.song for data in playlist_data]

                # Truy tất cả ArtistOfSong có liên quan đến các bài hát đó
                artistOfSong_data = ArtistOfSong.objects.filter(song__in=[song.id for song in list_song])

                # Gom tất cả artist id
                all_artist_ids = set()
                for tab in artistOfSong_data:
                    for nghesi in tab.artists:
                        all_artist_ids.add(nghesi.id)

                # Truy 1 lần tất cả artist theo id
                artist_objs = Artist.objects.filter(id__in=all_artist_ids)
                artist_dict = {artist.id: artist.artist_name for artist in artist_objs}

                # Tạo dict songId -> list artist info
                artists_data = {}
                for tab in artistOfSong_data:
                    if tab.song.id not in artists_data:
                        artists_data[tab.song.id] = []
                    for nghesi in tab.artists:
                        artists_data[tab.song.id].append({
                            "id": str(nghesi.id),
                            "artist_name": artist_dict.get(nghesi.id, "")
                        })

                # Kết hợp vào song_data
                song_data = [
                    {
                        "id": str(data.song.id),
                        "song_name": data.song.song_name,
                        "duration": data.song.duration,
                        "song_url": data.song.song_url,
                        "picture_url": data.song.picture_url,
                        "listen_count": data.song.listen_count,
                        "artists": artists_data.get(data.song.id, []),
                        "artist": {
                            "artist_name": data.song.artist.artist_name
                        }
                    }
                    for data in playlist_data
                ]

                return JsonResponse({
                    "songInPlaylist": song_data,
                }, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

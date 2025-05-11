from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import SongInAlbum
from Albums.models import Album
from ArtistOfSong.models import ArtistOfSong
from Artists.models import Artist
from bson import ObjectId

# Create your views here.
class SongInAlbumGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get("action")
            if action == "getSongsInAlbumIds":
                albumId = request.GET.get("albumId")
                
                if not albumId:
                    return JsonResponse({"error": "Thiếu playlistId"}, status=400)
                
                album = Album.objects.filter(id=ObjectId(albumId)).first()
                if not album:
                    return JsonResponse({"error": "Không tìm thấy album"}, status=404)

                album_data = SongInAlbum.objects.filter(album=album)
            
                #Lấy tất cả song trong playlist
                list_song = [data.song for data in album_data]

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
                    for data in album_data
                ]

                return JsonResponse({
                    "songInAlbum": song_data,
                }, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

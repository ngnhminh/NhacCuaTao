from django.shortcuts import render
from django.http import JsonResponse
from mongoengine.errors import DoesNotExist, ValidationError
from bson import ObjectId
from django.core.files.storage import default_storage
import json
from django.core.files.base import ContentFile
from mutagen.mp3 import MP3
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from Artists.models import Artist
from .models import Album
from django.conf import settings
from Songs.models import Song
from SongInAlbum.models import SongInAlbum

# Create your views here.
# Create your views here.
class AlbumPostView(APIView):
    def post(self, request):
        try:
            action = request.POST.get("action")
            # Gửi thông tin xác thực người dùng
            if action == "addNewAlbum":
                auth_header = request.headers.get('Authorization')
                
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()
                    
                    if auth_token:
                        user = auth_token.user
                        
                        artist = Artist.objects.get(user = user)
                        album_name = request.POST.get("album_name")
                        releaseDate = request.POST.get("releaseDate")
                        
                        songs_raw = request.POST.get("songs")
                        if not songs_raw:
                            return JsonResponse({"error": "No songs provided"}, status=400)
                        
                        album_picture = request.FILES.get("album_picture")
                        if not album_picture:
                            return JsonResponse({"error": "No cover uploaded"}, status=400)
                        
                        covername = f"covers/{album_picture.name}"
                        cover_path = default_storage.save(covername, album_picture)
                        cover_url = f"{settings.MEDIA_URL}{covername}"
                        
                        album_form = Album.objects.create(
                            album_name=album_name,
                            release_date=releaseDate,
                            artist=artist,
                            album_picture=cover_url
                        )
                        
                        try:
                            songs = json.loads(songs_raw)
                        except json.JSONDecodeError:
                            return JsonResponse({"error": "Invalid song list format"}, status=400)

                        for song_obj in songs:
                            song_id = song_obj.get("id")
                            if not song_id:
                                continue 
                            try:
                                song_data = Song.objects.get(id=ObjectId(song_id))
                                SongInAlbum.objects.create(album=album_form, song=song_data)
                            except Song.DoesNotExist:
                                continue 
                            
                        return JsonResponse({
                            "created": True,
                        }, status=201)
            return JsonResponse({"error": "Invalid action"}, status=400) 
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
class AlbumGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')

            if action == "getAllArtistAlbum":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if not auth_token:
                        return JsonResponse({"error": "Invalid token"}, status=403)

                    artistId = request.GET.get('artistId')
                    if not artistId:
                        return JsonResponse({"error": "Missing artistId"}, status=400)

                    artist = Artist.objects.get(id=ObjectId(artistId))
                    albumList = Album.objects.filter(artist=artist)

                    album_data = []
                    for data in albumList:
                        songs = SongInAlbum.objects.filter(album=data)
                        album_data.append({
                            "id": str(data.id),
                            "album_name": data.album_name,
                            "album_picture": data.album_picture,
                            "song_ids": [str(song.song.id) for song in songs],
                            "release_date": data.release_date,
                            "song_number": songs.count(),
                        })

                    return JsonResponse({"albumList": album_data}, status=200)

            elif action == "getAlbumInform":
                albumId = request.GET.get('albumId')
                if not albumId:
                    return JsonResponse({"error": "Missing albumId"}, status=400)

                album = Album.objects.get(id=ObjectId(albumId))
                songs = SongInAlbum.objects.filter(album=album)

                album_data = {
                    "id": str(album.id),
                    "album_name": album.album_name,
                    "album_picture": album.album_picture,
                    "song_ids": [str(song.song.id) for song in songs],
                    "release_date": album.release_date,
                    "song_number": songs.count(),
                    "songs_duration": sum([sip.song.duration for sip in SongInAlbum.objects.filter(album=album)]),
                    "artist": {
                        "id": str(album.artist.id),
                        "artist_name": album.artist.artist_name,
                        "avatar_url": album.artist.user.avatar_url
                    }
                }

                return JsonResponse({"album_data": album_data}, status=200)

            return JsonResponse({"error": "Invalid action"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

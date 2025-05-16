from django.shortcuts import render
from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from django.http import JsonResponse
from .models import History

from Songs.models import Song
from Artists.models import Artist

from AuthToken.models import AuthToken
from ArtistOfSong.models import ArtistOfSong

from datetime import datetime

from bson import ObjectId

# Create your views here.
class HistoryGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getAllHistory":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token"):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user

                        list_song = Song.objects.all()
                
                        artistOfSong_data = ArtistOfSong.objects.filter(song__in=[song.id for song in list_song])
                        
                        # Gom tất cả artist id
                        all_artist_ids = set()
                        for tab in artistOfSong_data:
                            for nghesi in tab.artists:
                                all_artist_ids.add(nghesi.id)

                        # Truy một lần
                        artist_objs = Artist.objects.filter(id__in=all_artist_ids)
                        artist_dict = {artist.id: artist.artist_name for artist in artist_objs}

                        # Gán vào artists_data
                        artists_data = {}
                        for tab in artistOfSong_data:
                            if tab.song.id not in artists_data:
                                artists_data[tab.song.id] = []
                            for nghesi in tab.artists:
                                artists_data[tab.song.id].append({
                                    "id": str(nghesi.id),
                                    "artist_name": artist_dict.get(nghesi.id, "")
                                })
                        
                        history_list = History.objects.filter(user=user).order_by('-time')
                        history_data = [
                            {
                                "id": str(fs.song.id),
                                "song_name": fs.song.song_name,
                                "duration": fs.song.duration,
                                "song_url": fs.song.song_url,
                                "picture_url": fs.song.picture_url,
                                "listion_count": fs.song.listen_count,
                                "artists": artists_data.get(fs.song.id, []),
                                "artist": {
                                    "id": str(fs.song.artist.id),
                                    "artist_name": fs.song.artist.artist_name
                                }
                            }
                            for fs in history_list
                        ]
                        return JsonResponse({"historyList": history_data}, status=201)
                    return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "Wrong Params"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class HistoryPostView(APIView):
    def post(self, request):
        try:
            action = request.data.get('action')
            if action == "addToHistory":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token"):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        songId = request.data.get('songId')
                        song = Song.objects.get(id=ObjectId(songId))             

                        history_song_existed = History.objects.filter(song=song,user=user)
                        history_song_existed.delete()
                        
                        current_time = datetime.now()
                        
                        History.objects.create(
                            user=user,
                            song=song,
                            time=current_time,
                        )
                        return JsonResponse({"created": True}, status=201)
                    return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "Wrong Params"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
from django.shortcuts import render
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from Songs.models import Song
from Users.models import User
from Artists.models import Artist
from ArtistOfSong.models import ArtistOfSong
from django.http import JsonResponse
# Create your views here.
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
class SongGetView(APIView):
    def get(self, request):
        try:
            action = request.query_params.get('action')
            if action == "getAllSong":
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
                
                songs_data = [
                    {
                        "id": str(song.id),
                        "song_name": song.song_name,
                        "duration": song.duration if hasattr(song, 'duration') else 0,
                        "song_url": song.song_url,
                        "picture_url": song.picture_url,
                        "listion_count": song.listen_count,
                        "artists": artists_data.get(song.id, []),
                        "artist": {
                            "artist_name": song.artist.artist_name
                        }
                    }
                    for song in list_song
                ]
                return Response({"songs": songs_data}, status=status.HTTP_200_OK)
            
            if action == "getAllSongOfArtistById":
                artistId = request.query_params.get('artistId')
                artist = Artist.objects.get(id=ObjectId(artistId))
                list_song = Song.objects.filter(artist=artist)
                
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
                
                songs_data = [
                    {
                        "id": str(song.id),
                        "song_name": song.song_name,
                        "duration": song.duration if hasattr(song, 'duration') else 0,
                        "song_url": song.song_url,
                        "picture_url": song.picture_url,
                        "listion_count": song.listen_count,
                        "artists": artists_data.get(song.id, []),
                        "artist": {
                            "artist_name": song.artist.artist_name
                        }
                    }
                    for song in list_song
                ]
                return Response({"songs": songs_data}, status=status.HTTP_200_OK)
            
            return Response({"error": "WrongParams"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class SongUpdateView(APIView):
    def post(self, request):
        try:
            action = request.data.get("action")
            print("action", action)
            if action == "updateSongView":
                songId = request.data.get("songId")
                print(songId)
                song = Song.objects.filter(id=ObjectId(songId)).first()
                if not song:
                    return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)

                # Tăng lượt nghe
                song.listen_count = song.listen_count + 1
                song.save()

                return Response({"message": "View count updated"}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

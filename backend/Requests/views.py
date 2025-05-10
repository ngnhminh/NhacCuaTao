from django.shortcuts import render
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from .models import ArtistRequest, SongRequest
from Artists.models import Artist
from Songs.models import Song
from Users.models import User
from ArtistOfSong.models import ArtistOfSong
from datetime import datetime
from django.http import JsonResponse
from mongoengine.errors import DoesNotExist, ValidationError
from bson import ObjectId
from django.core.files.storage import default_storage
import json
from django.core.files.base import ContentFile
from django.conf import settings

# Create your views here.
class RequestView(APIView):
    def post(self, request):
        try:
            action = request.data.get("action")
            # Gửi thông tin xác thực người dùng
            if action == "requestArtistApprove":
                fblink = request.data.get("fblink")
                auth_header = request.headers.get('Authorization')
                
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()
                    
                    if auth_token:
                        user = auth_token.user
                        approve_artist_form = ArtistRequest.objects.create(
                            status="0",
                            request_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                            link_confirm=fblink,
                            user=user
                        )
                        return JsonResponse({
                            "created": True,
                            "approveArtistForm_id": str(approve_artist_form.id)
                        }, status=201)
                return JsonResponse({"error": "Unauthorized"}, status=401)
            
            action = request.POST.get("action")
            if action == "requestSongApprove":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        artist = Artist.objects.get(user=user)

                        title = request.POST.get("title")
                        releaseDate = request.POST.get("releaseDate")
                        ageRestricted = request.POST.get("ageRestricted")

                        music_file = request.FILES.get('musicFile')
                        cover_file = request.FILES.get('cover')

                        if not cover_file:
                            return JsonResponse({"error": "No cover uploaded"}, status=400)
                        
                        if not music_file:
                            return JsonResponse({"error": "No music file uploaded"}, status=400)

                        # Parse featuredArtists from JSON string
                        featured_artists_raw = request.POST.get("featuredArtists", "[]")
                        try:
                            cover_artist_objs = json.loads(featured_artists_raw)
                        except json.JSONDecodeError:
                            return JsonResponse({"error": "Invalid JSON for featured artists"}, status=400)

                        # Lọc các artist dựa trên ID
                        cover_artists = list(Artist.objects.filter(id__in=[artist['id'] for artist in cover_artist_objs]))

                        # Lưu file nhạc và ảnh bìa
                        musicname = f"audios/{music_file.name}"
                        covername = f"covers/{cover_file.name}"
                        music_path = default_storage.save(musicname, music_file)
                        cover_path = default_storage.save(covername, cover_file)
                        music_url = f"{settings.MEDIA_URL}{musicname}"
                        cover_url = f"{settings.MEDIA_URL}{covername}"
                        
                        # Tạo song request mới
                        songRequest_form = SongRequest.objects.create(
                            title=title,
                            status=0,
                            release_date=releaseDate,
                            is_explicit=ageRestricted,
                            duration=0,
                            picture_url=cover_url,
                            song_url=music_url,
                            artist=artist,
                            cover_artists=cover_artists
                        )

                        return JsonResponse({
                            "created": True,
                            "songRequest_form": str(songRequest_form.id)
                        }, status=201)

                return JsonResponse({"error": "Unauthorized"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

        
# Trang Duyệt người dùng
class ArtistApproveFormView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getAllApproveArtistForms":
                artist_requests = ArtistRequest.objects.all()
                result = []
                for req in artist_requests:
                    result.append({
                        "id": str(req.id),
                        "status": req.status,
                        "request_date": req.request_date,
                        "link_confirm": req.link_confirm,
                        "user": {
                            "id": str(req.user.id),
                            "full_name": req.user.full_name,
                            "email": req.user.email
                        }
                    })
                return JsonResponse({"list": result}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    

    def post(self, request):
        try:
            action = request.data.get('action')
            if action == "approveArtist":
                userdata = request.data.get("user")
                user = User.objects.get(id=ObjectId(userdata["id"]))  # <-- sửa ở đây
                artist_name = request.data.get("artist_name")
                formId = request.data.get("formId")
                ArtistRequest.objects(id=ObjectId(formId)).update(set__status = 1)
                
                new_artist = Artist.objects.create(
                    artist_name=artist_name,
                    country="",
                    active_years=datetime.now().year,
                    followers=0,
                    description="",
                    user=user,
                )
                
                return JsonResponse({
                    "created": True,
                }, status=201)
                
            return JsonResponse({"error": "Unauthorized"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class SongApproveFormView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getAllApproveSongsForms":
                song_requests = SongRequest.objects.all()
                result = []
                for req in song_requests:
                    result.append({
                        "id": str(req.id),
                        "status": req.status,
                        "release_date": req.release_date,
                        "duration": req.duration,
                        "picture_url": req.picture_url,
                        "song_url": req.song_url,
                        "is_explicit": req.is_explicit,
                        "title": req.title,
                        "artist": {
                            "id": str(req.artist.id),
                            "artist_name": req.artist.artist_name,
                            "country": req.artist.country,
                            "fullname": req.artist.user.full_name
                        }
                    })
                return JsonResponse({"list": result}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
    # Hàm duyệt nhạc
    def post(self, request):
        try:
            action = request.data.get('action')
            if action == "approveSong":
                artistdata = request.data.get("artist")
                artist = Artist.objects.get(id=ObjectId(artistdata["id"]))
                formId = request.data.get("formId")
                SongRequest.objects(id=ObjectId(formId)).update(set__status = 1)
                songRequest = SongRequest.objects(id=ObjectId(formId)).first()
                new_song = Song.objects.create(
                    song_name=songRequest.title,
                    release_date=songRequest.release_date,
                    duration=0,
                    song_url=songRequest.song_url,
                    picture_url=songRequest.picture_url,
                    is_explicit=songRequest.is_explicit,
                    listen_count=0,
                    artist = artist
                )
                
                if len(songRequest.cover_artists) > 0:
                    artist_of_song = ArtistOfSong.objects.create(
                        artists=songRequest.cover_artists,
                        song=new_song
                    )

                    return JsonResponse({
                        "created ArtistOfSong": True,
                        "ArtistOfSongId": str(artist_of_song.id)
                    }, status=201)

                return JsonResponse({
                    "created Song": True,
                    "SongId": str(new_song.id)
                }, status=201)

            return JsonResponse({"error": "Unauthorized"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

#Hàm xóa đơn duyệt nghệ sĩ
class ArtistApproveDeleteFormView(APIView):
    def delete(self, request, id):
        try:
            artist_request = ArtistRequest.objects.get(id=id)
            artist_request.delete()
            return JsonResponse({"message": "Xóa thành công"}, status=204)
        except (DoesNotExist, ValidationError):
            return JsonResponse({"error": "Không tìm thấy hoặc ID không hợp lệ"}, status=404)

#Hàm xóa đơn duyệt nhạc sĩ       
class SongApproveDeleteFormView(APIView):
    def delete(self, request, id):
        try:
            song_request = SongRequest.objects.get(id=id)
            song_request.delete()
            return JsonResponse({"message": "Xóa thành công"}, status=204)
        except (DoesNotExist, ValidationError):
            return JsonResponse({"error": "Không tìm thấy hoặc ID không hợp lệ"}, status=404)
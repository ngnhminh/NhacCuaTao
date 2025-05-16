from django.shortcuts import render
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from .models import ArtistFollow
from Artists.models import Artist
from django.http import JsonResponse
from bson import ObjectId
from mongoengine.errors import DoesNotExist, ValidationError
from bson.errors import InvalidId
from django.core.exceptions import ObjectDoesNotExist
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from datetime import datetime
from Notification.models import Notification

# Create your views here.
class ArtistFollowGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getAllfollowedArtistIds":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        fav_artist_list = ArtistFollow.objects(user=user).select_related()

                        artist_ids = [fs.artist for fs in fav_artist_list]

                        fav_artist_data = [
                            {
                                "id": str(fs.id),
                                "artist_name": fs.artist_name,
                                "picture_url": fs.user.avatar_url,
                            }
                            for fs in artist_ids
                        ]
                        return JsonResponse({"favArtistList": fav_artist_data}, status=201)
                    return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "WrongParam"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)    

class ArtistFollowPostView(APIView):
    def post(self, request):
        try:
            data = request.data
            action = data.get("action")
            
            if action == "followArtist":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        artistId = data.get("artistId")
                        artist = Artist.objects.get(id=ObjectId(artistId))
                        ArtistFollow.objects.create(user=user, artist=artist)
                        
                        artist.followers += 1
                        artist.save()
                        
                        current_time = datetime.now()

                        new_notification = {
                            "type": "artist",
                            "artist": artist,
                            "status": 0,
                            "description": " đã theo dõi bạn",
                            "time": current_time,
                            "user": user
                        }
                        Notification.objects.create(**new_notification)
                        
                        #Hàm gửi thông báo tới channel
                        channel_layer = get_channel_layer()
                        async_to_sync(channel_layer.group_send)(
                            f"artist_{str(artist.id)}",
                            {
                                "type": "send_notification",
                                "message": {
                                    "type": "artist_notification",
                                    "status": 0,
                                    "time": current_time.strftime('%Y-%m-%d %H:%M:%S'),
                                    "description": "đã theo dõi bạn",
                                    "user": {
                                        "full_name": artist.artist_name,
                                        "avatar_url": user.avatar_url
                                    }
                                }
                            }
                        )
                        
                        return JsonResponse({"created": True}, status=201)

                    return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "Invalid action"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class ArtistFollowDeleteView(APIView):
    def delete(self, request, id):
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith("Token "):
                token = auth_header.split(' ')[1]
                auth_token = AuthToken.objects.filter(token=token).first()

                if auth_token:
                    user = auth_token.user
                    artist = Artist.objects.get(id=ObjectId(id))
                    artist.followers -= 1
                    artist.save()
                    unfollow_artist = ArtistFollow.objects.get(user=user, artist=artist)
                    if not unfollow_artist:
                        return JsonResponse({"error": "Chưa follow nghệ sĩ"}, status=404)
                    unfollow_artist.delete()
                    return JsonResponse({"message": "Xóa thành công", "removed": True}, status=200)
        except (ObjectDoesNotExist, InvalidId):
            return JsonResponse({"error": "Không tìm thấy hoặc ID không hợp lệ"}, status=404)
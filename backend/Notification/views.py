from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from django.http import JsonResponse
from .models import Notification
from Artists.models import Artist
from AuthToken.models import AuthToken

# Create your views here.
class NotificationGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getAllNotification":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token"):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        
                        type = request.GET.get("type")
                        if type == "user":
                            notification_list = Notification.objects.filter(user=user, type="user").order_by('-time')
                            notification_data = [
                                {
                                    "id": str(fs.id),
                                    "status": fs.status,
                                    "description": fs.description,
                                    "time": fs.time,
                                    "img": fs.img,
                                    "artist": {
                                        "artist_name": fs.artist.artist_name,
                                        "avatar_url": fs.artist.user.avatar_url
                                    }
                                }
                                for fs in notification_list
                            ]
                        if type == "artist":
                            artist = Artist.objects.get(user=user)
                            notification_list = Notification.objects.filter(artist=artist, type="artist").order_by('-time')
                            notification_data = [
                                {
                                    "id": str(fs.id),
                                    "status": fs.status,
                                    "description": fs.description,
                                    "time": fs.time,
                                    "user": {
                                        "full_name": fs.user.full_name,
                                        "avatar_url": fs.user.avatar_url
                                    }
                                }
                                for fs in notification_list
                            ]
                        return JsonResponse({"notificationList": notification_data}, status=201)
                    return JsonResponse({"error": "Unauthorized"}, status=401)
            return JsonResponse({"error": "Wrong Params"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
class NotificationPostView(APIView):
    def post(self, request):
        try:
            action = request.data.get('action')
            print(action)
            if action == "notificationReaded":
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()

                    if auth_token:
                        user = auth_token.user
                        type = request.data.get('type')
                        
                        if type == "artist":
                            artist = Artist.objects.get(user=user)
                            Notification.objects(artist=artist, status=0, type=type).update(set__status=1)
                        if type == "user":
                            Notification.objects(user=user, status=0, type=type).update(set__status=1)
                            
                        return JsonResponse({"isDone": True}, status=201)
            return JsonResponse({"error": "VAILON"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

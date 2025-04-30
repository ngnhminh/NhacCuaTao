from django.shortcuts import render
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from .models import ArtistRequest
from Artists.models import Artist
from Users.models import User
from datetime import datetime
from django.http import JsonResponse
from mongoengine.errors import DoesNotExist, ValidationError
from bson import ObjectId

# Create your views here.
class RequestView(APIView):
    # Gửi thông tin xác thực người dùng
    def post(self, request):
        try:
            action = request.data.get("action")
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

            return JsonResponse({"error": "Invalid action"}, status=400)

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

                new_artist = Artist.objects.create(
                    artist_name=artist_name,
                    profile_picture="",
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

class ArtistApproveDeleteFormView(APIView):
    def delete(self, request, id):
        try:
            artist_request = ArtistRequest.objects.get(id=id)
            artist_request.delete()
            return JsonResponse({"message": "Xóa thành công"}, status=204)
        except (DoesNotExist, ValidationError):
            return JsonResponse({"error": "Không tìm thấy hoặc ID không hợp lệ"}, status=404)
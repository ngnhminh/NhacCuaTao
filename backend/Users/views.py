from django.shortcuts import render
from django.contrib.auth.hashers import check_password
import json
from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def login_user(request):
    # email= request.POST.get("email")
    # password = request.POST.get("password")
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)  # ✅ Đọc JSON từ body
            email = data.get("email")
            password = data.get("password")
            user = User.objects.get(email=email)
            # if check_password(password, user.password):
            if password == user.password:
                user_data = {
                    "user_id": str(user.user_id),
                    "fullname": user.full_name,
                    "email": user.email,
                }
                return JsonResponse(user_data)
            else:
                return JsonResponse({"error": "Invalid password"}, status=401)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

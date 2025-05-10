from django.shortcuts import render
from rest_framework.views import APIView
from AuthToken.models import AuthToken
from Artists.models import Artist
from Users.models import User
from django.http import JsonResponse
from bson import ObjectId

# Create your views here.

class ArtistUpdateView(APIView):
    def post(self, request):
        try:
            action = request.data.get('action')
            if action == "updateArtistInform":
                full_name = request.data.get("full_name")
                description = request.data.get("description")
                country = request.data.get("country")
                
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith("Token "):
                    token = auth_header.split(' ')[1]
                    auth_token = AuthToken.objects.filter(token=token).first()
                    
                    if auth_token:
                        user = auth_token.user
                        user.update(set__full_name = full_name)
                        Artist.objects(user=user).update(set__description = description, set__country =  country)
                    return JsonResponse({
                    "created": True,
                        }, status=201)
                return JsonResponse({"error": "Unauthorized"}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


class ArtistGetView(APIView):
    def get(self, request):
        try:
            action = request.GET.get('action')
            if action == "getAllArtist":
                listArtist = list(Artist.objects.all())
                artists_data = [
                    {
                        "id": str(artist.id),
                        "name": artist.artist_name,
                        "active_years": artist.active_years,
                        "user": {
                            "avatar_url": artist.user.avatar_url
                        }
                    }
                    for artist in listArtist
                ]
                return JsonResponse({"artists": artists_data}, status=200)
            
            if action == "getArtistInform":
                artistId = request.GET.get('artistId')
                artist = Artist.objects.get(id=ObjectId(artistId))
                artists_data = {
                        "id": str(artist.id),
                        "name": artist.artist_name,
                        "active_years": artist.active_years,
                        "description": artist.description,
                        "user": {
                            "avatar_url": artist.user.avatar_url
                        }
                    }
                return JsonResponse({"artist": artists_data}, status=200)
            return JsonResponse({"error": "WrongParams"}, status=400)  
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


            
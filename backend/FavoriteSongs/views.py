from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import FavoriteSongs
from Songs.models import Song
from Users.models import User

def add_to_favorites(request):
    user_id = request.GET.get('user_id')
    song_id = request.GET.get('song_id')
    
    user = User.objects.get(id=user_id)
    song = Song.objects.get(id=song_id)
    
    favorite = FavoriteSongs(user=user, song=song)
    favorite.save()
    
    return JsonResponse({'message': 'Song added to favorites'}, status=200)
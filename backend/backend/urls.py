"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('Users.urls')),
    path('api/artists/', include('Artists.urls')),
    path('api/requests/', include('Requests.urls')),
    path('api/songs/', include('Songs.urls')),
    path('api/playlists/', include('Playlists.urls')),
    path('api/favoriteSongs/', include('FavoriteSongs.urls')),
    path('api/songInPlaylist/', include('SongInPlaylist.urls')),
    path('api/songInAlbum/', include('SongInAlbum.urls')),
    path('api/albums/', include('Albums.urls')),
    path('api/artistFollow/', include('ArtistFollow.urls')),
    path('api/notifications/', include('Notification.urls')),
    path('api/history/', include('History.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

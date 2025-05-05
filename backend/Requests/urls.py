from .views import RequestView, ArtistApproveFormView, ArtistApproveDeleteFormView, SongApproveFormView, SongApproveDeleteFormView
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('RequestView/', RequestView.as_view(), name='RequestView'),
    path('ArtistApproveDeleteForm/<str:id>/', ArtistApproveDeleteFormView.as_view(), name='delete_approve_artist'),
    path('SongApproveDeleteForm/<str:id>/', SongApproveDeleteFormView.as_view(), name='delete_approve_song'),
    path('ArtistApproveForm/', ArtistApproveFormView.as_view(), name='approve_artist'),
    path('SongApproveForm/', SongApproveFormView.as_view(), name='approve_song'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
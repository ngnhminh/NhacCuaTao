from .views import RequestView, ArtistApproveFormView, ArtistApproveDeleteFormView
from django.urls import path

urlpatterns = [
    path('RequestView/', RequestView.as_view(), name='RequestView'),
    path('ArtistApproveDeleteForm/<str:id>/', ArtistApproveDeleteFormView.as_view(), name='delete_approve_artist'),
    path('ArtistApproveForm/', ArtistApproveFormView.as_view(), name='approve_artist'),
]
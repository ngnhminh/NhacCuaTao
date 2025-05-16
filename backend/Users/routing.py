from django.urls import path
from . import user

websocket_urlpatterns = [
    path('ws/notifications/', user.NotificationUser.as_asgi()),  # WebSocket endpoint
]

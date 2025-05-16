from .views import NotificationGetView, NotificationPostView
from django.urls import path 

urlpatterns = [
    path('NotificationGetView/', NotificationGetView.as_view(), name='NotificationGetView'),
    path('NotificationPostView/', NotificationPostView.as_view(), name='NotificationPostView'),
] 
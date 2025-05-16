from .views import HistoryGetView, HistoryPostView
from django.urls import path 

urlpatterns = [
    path('HistoryGetView/', HistoryGetView.as_view(), name='HistoryGetView'),
    path('HistoryPostView/', HistoryPostView.as_view(), name='HistoryPostView'),
] 
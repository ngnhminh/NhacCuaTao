from mongoengine import Document, IntField, ReferenceField
from Playlists.models import Playlist
from Songs.models import Song
# Create your models here.

class SongInPlaylist(Document):
    playlist = ReferenceField(Playlist, required=True)  
    song = ReferenceField(Song, required=True)  
    meta = {
        'collection': 'SongInPlaylist'
    }
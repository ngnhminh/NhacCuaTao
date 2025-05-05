from Artists.models import Artist
from Songs.models import Song
# Create your models here.
from mongoengine import Document, ListField, ReferenceField

class ArtistOfSong(Document):
    artists = ListField(ReferenceField(Artist))
    song = ReferenceField(Song, required=True)  # Liên kết với Song (tạo model Song tương tự)
    meta = {
        'collection': 'ArtistOfSong'
    }
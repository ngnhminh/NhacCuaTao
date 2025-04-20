from Albums.models import Album
from Songs.models import Song
# Create your models here.
from mongoengine import Document, IntField, ReferenceField

class SongInAlbum(Document):
    album = ReferenceField(Album, required=True)  # Liên kết với Album
    song = ReferenceField(Song, required=True)  # Liên kết với Song (tạo model Song tương tự)

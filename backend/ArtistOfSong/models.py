from Genres.models import Genre
from Artists.models import Artist
from Songs.models import Song
# Create your models here.
from mongoengine import Document, IntField, ReferenceField

class ArtistOfSong(Document):
    artist = ReferenceField(Artist, required=True)  # Liên kết với Artist
    song = ReferenceField(Song, required=True)  # Liên kết với Song (tạo model Song tương tự)

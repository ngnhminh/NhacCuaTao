from mongoengine import Document, StringField, IntField, LongField, ReferenceField
from Genres.models import Genre
from Songs.models import Song

# Create your models here.
class SongGenre(Document):
    genre = ReferenceField(Genre, required=True)  # Liên kết đến Genre
    song = ReferenceField(Song, required=True)  # SongId là khóa chính
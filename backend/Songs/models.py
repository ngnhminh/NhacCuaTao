from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField
from Artists.models import Artist
# Create your models here.

class Song(Document):
    song_name = StringField(max_length=255)
    release_date = StringField()  
    duration = DateTimeField()  # Sử dụng DateTimeField cho thời lượng bài hát
    song_url = StringField(max_length=255)
    picture_url = StringField(max_length=255)
    is_explicit = IntField()
    listen_count = IntField(default=0)
    artist = ReferenceField(Artist, required=True)
    meta = {
        'collection': 'Song'
    }
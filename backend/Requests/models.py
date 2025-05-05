from mongoengine import Document, StringField, ReferenceField, IntField, DateTimeField, ListField
# Create your models here.
from Users.models import User
from Artists.models import Artist

class ArtistRequest(Document):
    status = IntField(max_length=255, required=True)  
    request_date = DateTimeField(max_length=255, required=True)  
    link_confirm = StringField(max_length=255)
    user = ReferenceField(User, required=True)

    meta = {
        'collection': 'ArtistRequest'
    }

class SongRequest(Document):
    status = IntField(max_length=255, required=True)  
    release_date = DateTimeField()  
    duration = IntField()  # Sử dụng DateTimeField cho thời lượng bài hát
    picture_url = StringField(max_length=255)
    song_url = StringField(max_length=255)
    is_explicit = IntField()
    artist = ReferenceField(Artist, required=True)
    cover_artists = ListField(ReferenceField(Artist))
    title = StringField(max_length=255)
    meta = {
        'collection': 'SongRequest'
    }
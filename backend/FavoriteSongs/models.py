from Songs.models import Song
from Users.models import User
# Create your models here.
from mongoengine import Document, IntField, ReferenceField

class FavoriteSongs(Document):
    user = ReferenceField(User, required=True)
    song = ReferenceField(Song, required=True)  
    meta = {
            'collection': 'FavoriteSong'
        }
from Users.models import User
# Create your models here.
from mongoengine import Document, StringField, IntField, ReferenceField

class Playlist(Document):
    playlist_name = StringField(max_length=255, required=True) 
    user = ReferenceField(User, required=True) 
    playlist_picture = StringField(max_length=255) 
    meta = {
            'collection': 'Playlist'
        }
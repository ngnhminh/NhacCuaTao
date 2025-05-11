from Artists.models import Artist
# Create your models here.
from mongoengine import Document, StringField, IntField, ReferenceField, DateField

class Album(Document):
    release_date = StringField(required=True) 
    album_name = StringField(max_length=255, required=True)  
    artist = ReferenceField(Artist, required=True)  
    album_picture = StringField(max_length=255) 
    meta = {
        'collection': 'Album'
    }
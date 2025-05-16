from mongoengine import Document, ListField, ReferenceField
from Artists.models import Artist
from Users.models import User
# Create your models here.
class ArtistFollow(Document):
    artist = ReferenceField(Artist, required=True)
    user = ReferenceField(User, required=True) 
    meta = {
        'collection': 'ArtistFollow'
    }
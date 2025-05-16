# Create your models here.
from mongoengine import Document, StringField, ReferenceField
from Users.models import User 
from Artists.models import Artist

class AuthToken(Document):
    user = ReferenceField(User)
    token = StringField(required=True)
    artist = ReferenceField(Artist)
    
    meta = {'collection': 'AuthToken'}

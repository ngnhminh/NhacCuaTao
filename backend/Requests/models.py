from mongoengine import Document, StringField, ReferenceField, IntField, DateTimeField
# Create your models here.
from Users.models import User

class ArtistRequest(Document):
    status = IntField(max_length=255, required=True)  
    request_date = DateTimeField(max_length=255, required=True)  
    link_confirm = StringField(max_length=255)
    user = ReferenceField(User, required=True)

    meta = {
        'collection': 'ArtistRequest'
    }
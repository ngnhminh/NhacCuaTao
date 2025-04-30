# Create your models here.
from mongoengine import Document, StringField, ReferenceField
from Users.models import User 

class AuthToken(Document):
    user = ReferenceField(User)
    token = StringField(required=True)

    meta = {'collection': 'AuthToken'}

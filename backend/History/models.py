from django.db import models
from Users.models import User
from Songs.models import Song
from mongoengine import Document, ReferenceField, DateTimeField
from datetime import datetime

# Create your models here.
class History(Document):
    user = ReferenceField(User, required=True)
    song = ReferenceField(Song, required=True)
    time = DateTimeField(default=datetime.utcnow)
    meta = {
        'collection': 'History',
    }

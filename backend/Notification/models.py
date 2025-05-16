from django.db import models
from mongoengine import Document, StringField, ReferenceField, IntField, DateTimeField, ListField, DateField
from datetime import datetime
from Users.models import User
from Artists.models import Artist

# Create your models here.

class Notification(Document):
    status = IntField(required=True) # 0 = chưa đọc, 1 = đã đọc
    description = StringField(max_length=255, required=True)
    time = DateTimeField(default=datetime.utcnow)
    img = StringField()
    user = ReferenceField(User, required=True)
    artist = ReferenceField(Artist, required=True)
    type = StringField(required=True)
    
    meta = {
        'collection': 'Notification',
    }

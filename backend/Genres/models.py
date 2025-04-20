from django.db import models
from mongoengine import Document, StringField, IntField

# Create your models here.
class Genre(Document):
    genre_id = IntField(primary_key=True)  # GenreId là khóa chính
    genre_name = StringField(max_length=255)

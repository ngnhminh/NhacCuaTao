from django.db import models
from mongoengine import Document, StringField, IntField

# Create your models here.

class User(Document):
    user_id = IntField(primary_key=True)  # Trường UserId sẽ là khóa chính
    full_name = StringField(max_length=255, required=True)  # Tên đầy đủ
    email = StringField(max_length=255, required=True)  # Email
    password = StringField(max_length=255, required=True)  # Mật khẩu

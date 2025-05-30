from mongoengine import Document, StringField, IntField

# Create your models here.

class User(Document):
    full_name = StringField(max_length=255, required=True)  # Tên đầy đủ
    email = StringField(max_length=255, required=True)  # Email
    password = StringField(max_length=255, required=True)  # Mật khẩu
    avatar_url = StringField(max_length=255)
    status = IntField()
    meta = {
        'collection': 'User'
    }

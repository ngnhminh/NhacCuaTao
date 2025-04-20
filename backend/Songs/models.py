from mongoengine import Document, StringField, IntField, DateTimeField, ReferenceField

# Create your models here.

class Song(Document):
    song_id = IntField(primary_key=True)  # SongId là khóa chính
    song_name = StringField(max_length=255)
    release_date = DateTimeField()  
    duration = DateTimeField()  # Sử dụng DateTimeField cho thời lượng bài hát
    song_picture = StringField(max_length=255)
    is_explicit = IntField()
    listen_count = IntField(default=0)
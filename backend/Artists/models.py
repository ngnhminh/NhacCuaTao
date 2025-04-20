from mongoengine import Document, StringField, IntField, LongField, ReferenceField
from Users.models import User
# Create your models here.


class Artist(Document):
    artist_id = IntField(primary_key=True)  # ArtistId là khóa chính
    artist_name = StringField(max_length=255, required=True)  # Tên nghệ sĩ
    profile_picture = StringField(max_length=255)  # Hình ảnh đại diện
    country = StringField(max_length=255)  # Quốc gia
    active_years = StringField(max_length=50)  # Năm hoạt động
    followers = LongField()  # Số người theo dõi
    monthly_listener = LongField()  # Số người nghe hàng tháng
    description = StringField()  # Mô tả
    user = ReferenceField(User, required=True)  # Liên kết với model User

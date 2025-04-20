import mongoengine
from .settings import MONGO_DB, MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD, MONGO_AUTH_SOURCE

def init_db():
    """Kết nối tới MongoDB"""
    mongoengine.connect(
        db=MONGO_DB,
        host=MONGO_URI,
        username=MONGO_USERNAME,
        password=MONGO_PASSWORD,
        authentication_source=MONGO_AUTH_SOURCE
    )

# Gọi init_db() để thiết lập kết nối khi ứng dụng khởi động
init_db()

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class NotificationUser(AsyncWebsocketConsumer):
    async def connect(self):        
        await self.accept()
        self.groups_joined = set() #Lưu danh sách mà các client đã đăng kí

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'subscribe': #NẾu data là loại subcribe thì cho vô nhóm
            group = data['channel']
            await self.channel_layer.group_add(group, self.channel_name)
            self.groups_joined.add(group)
        elif data['type'] == 'unsubscribe':
            group = data['channel']
            await self.channel_layer.group_discard(group, self.channel_name) #BỎ ra khỏi nhóm
            self.groups_joined.discard(group)

    async def disconnect(self, close_code):
        for group in self.groups_joined:
            await self.channel_layer.group_discard(group, self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))
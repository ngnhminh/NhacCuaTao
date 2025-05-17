WELECOME TO WEBSITE MUSIC "NHAC CUA TAO AKA NHACCUATAO"
Yêu cầu hệ thống
•	Hệ điều hành: Windows hoặc Ubuntu
•	Python 3.9 trở lên
•	NodeJS 18 trở lên
•	MongoDB
•	Trình duyệt hỗ trợ HTML5

Cài đặt backend
1	git  clone  https://github.com/ngnhminh/NhacCuaTao.git
2	cd backend
3	virtualenv myenv hoặc python -m virtualenv myenv
4	myenv/ Scripts/ activate
5	pip install -r requirements.txt hoặc python -m pip install -r requirements. txt
7	daphne backend.asgi:application 
8	Backend trang http://127.0.0.1:8000/

Cài đặt frontend
1	git  clone  https://github.com/ngnhminh/NhacCuaTao.git
2	cd frontend
3	npm install
4	npm run dev


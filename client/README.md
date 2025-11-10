2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env file in the backend/ folder:

PORT=5000
MONGO_URI=mongodb+srv://<your_user>:<your_password>@cluster.mongodb.net/categories
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

4️⃣ Run the server
npm start

Your backend should now run on:

http://localhost:5000

🌩️ Cloudinary Setup

Go to https://cloudinary.com

Create an account (Free)

Copy your credentials and place them in .env as shown above

Create a folder named categories (optional, Cloudinary will auto-create)

🚀 Frontend Setup
1️⃣ Navigate to frontend
cd ../frontend

2️⃣ Install dependencies
npm install

3️⃣ Run the app
npm run dev

Frontend runs at:

http://localhost:5173

Make sure the backend is running first.

🔄 API Endpoints (for Postman / curl)
➕ Create a Category

POST /api/categories
Form Data (multipart/form-data):

Key Type Description
name Text Category name
image File Category image
subcategory_names Text[] Names of subcategories
subcategory_images File[] Images of subcategories

✅ Example (only category):

name = "Detox Foot Spas"
image = detox.jpg

✅ Example (with subcategories):

name = "EMS Suits"
image = main.jpg
subcategory_names = Katalyst
subcategory_images = katalyst.jpg
subcategory_names = Vision Body
subcategory_images = vision.jpg

✏️ Update Category

PUT /api/categories/:id
Same request body as above (multipart/form-data).

❌ Delete Category

DELETE /api/categories/:id

📋 Get All Categories

GET /api/categories

🧭 Testing via Postman

Start your backend and frontend servers.

Open Postman.

Choose request type (POST, PUT, DELETE, GET).

Use http://localhost:5000/api/categories as base.

For POST/PUT → select Body → form-data, then attach:

name

image

(optional) multiple subcategory_names and subcategory_images

💅 UI Overview

Clean admin interface

Add, edit, delete, and refresh categories dynamically

Subcategory preview thumbnails

Real-time updates after each action

Responsive layout with TailwindCSS

🧱 Future Improvements

Add JWT-based admin login

Drag-and-drop image upload

Pagination & search

Dashboard stats (total categories/subcategories)

👨‍💻 Author

Ahmed Afzal
React & MERN Stack Developer
📧 ahmed.afzal@example.com

🪄 License

MIT License — Feel free to use and modify for your projects.

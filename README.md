# LearnX 

LearnX is a full-stack Learning Management System built as a **portfolio and evaluation project**.

This project is **not open source**.
The code is shared publicly **for demonstration purposes only**.

If you are a company, startup, or institution interested in:
- Licensing this LMS
- Custom development
- Hiring the developer

Please contact me below.

If you want to build an LMS / training platform (for a company, coaching, courses, internal onboarding, etc.) and you want me to help you build it, you can reach me here:

- Email: **rithish.r.2307@gmail.com**
- LinkedIn: **https://www.linkedin.com/in/rithish-to-connect**
- GitHub: **https://github.com/Rithishingit**


LearnX is a full‑stack Learning Management System I built using **React (Vite)** + **Node/Express** + **MongoDB**.

## What you get

- **Auth**: email/password + OAuth (Google/GitHub/Microsoft)
- **Roles**: student / instructor / admin
- **Courses**: browse, search, course detail, lessons
- **Enrollments + progress tracking**
- **Reviews + wishlist**
- **Gamification**: streaks + leaderboard
- **Certificates** on completion
- **Payments**: Razorpay (easy to swap with Stripe)

---

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router, Axios
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Passport, Nodemailer, Razorpay

---

## Project structure

LearnX/
├── 📂 backend/                 # Express.js API Server
│   ├── 📂 config/
│   │   └── passport.js         # OAuth configuration
│   ├── 📂 controllers/
│   │   ├── adminController.js  # Admin operations
│   │   ├── authController.js   # Auth (login, register, OAuth)
│   │   ├── courseController.js # Course CRUD
│   │   ├── paymentController.js# Payment processing
│   │   ├── reviewController.js # Course reviews
│   │   └── userController.js   # User operations
│   ├── 📂 middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── 📂 models/
│   │   ├── Course.js           # Course schema
│   │   ├── Enrollment.js       # Enrollment tracking
│   │   ├── Review.js           # Review schema
│   │   └── User.js             # User schema
│   ├── 📂 routes/
│   │   ├── adminRoutes.js      # /api/admin/*
│   │   ├── aiRoutes.js         # /api/ai/*
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── courseRoutes.js     # /api/courses/*
│   │   ├── enrollmentRoutes.js # /api/enrollments/*
│   │   ├── paymentRoutes.js    # /api/payments/*
│   │   ├── reviewRoutes.js     # /api/reviews/*
│   │   └── userRoutes.js       # /api/users/*
│   ├── .env.example            # Environment template
│   ├── package.json
│   ├── seed-all-courses.js     # Database seeder
│   ├── seed-users.js           # User seeder
│   └── server.js               # Entry point
│
├── 📂 frontend/                # React + Vite App
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── AnimatedLesson.jsx
│   │   │   ├── BrandLogo.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Certificate.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseReviews.jsx
│   │   │   ├── Homepage.jsx    # Landing page
│   │   │   ├── LearnXAI.jsx    # AI assistant
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── StreakWidget.jsx
│   │   ├── 📂 pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CreateCourse.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OAuthCallback.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── Wishlist.jsx
│   │   ├── 📂 services/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css           # Tailwind + custom styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
---

## Run it locally

### Prerequisites

- Node.js 18+
- MongoDB (local) or MongoDB Atlas

### Backend (API)

1. Go to the backend folder and install dependencies

```bash
cd backend
npm install
```

2. Create your env file

- Copy `backend/.env.example` → `backend/.env`
	- Windows (PowerShell): create the file manually or copy it in File Explorer
	- macOS/Linux: `cp .env.example .env`

3. (Optional) Seed some sample data

```bash
npm run seed
```

4. Start the server

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend (web)

1. Go to the frontend folder and install dependencies

```bash
cd frontend
npm install
```

2. Create your env file

- Copy `frontend/.env.example` → `frontend/.env`

3. Start the app

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Environment variables

I kept it simple: check the `.env.example` files in `backend/` and `frontend/` and fill in what you need.

Minimum to run the backend:

- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL` (usually `http://localhost:3000`)

Payments / email / OAuth are optional for local testing, but you’ll need real keys to use them.

---

## Notes (quick heads-up)

- CORS is currently open for development convenience. Lock it down before production.
- Razorpay can be swapped out (Stripe etc.) inside `backend/controllers/paymentController.js`.

---

## Contributing

If you want to improve something, feel free to open a PR.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the custom "All Rights Reserved" License


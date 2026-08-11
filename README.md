# LearnX

LearnX is a full-stack learning platform under active development. The current codebase is a React/Vite + Node/Express + MongoDB application that is being evolved from an LMS prototype toward a broader learning infrastructure.

> **Current development principle:** real data over invented claims, reusable systems over page-specific hacks, and product-quality interaction over decorative UI.

## Current status — 11 August 2026

### Local development baseline

- Frontend: React 18 + Vite 5
- Backend: Node.js + Express
- Database: MongoDB/Mongoose
- Frontend development server: `http://localhost:3000`
- Backend development server: `http://localhost:5000`
- Current local Node.js: 24.19.0
- Current local npm: 11.17.0
- MongoDB service is running in the current Windows development environment.

### Homepage milestone

The homepage has moved away from a conventional LMS template toward a more spatial, exploratory product experience.

The current homepage direction includes:

- LearnX hero messaging: **Learn Without Limits. Build Beyond Them.**
- A database-derived learning explorer rather than hardcoded domain boxes.
- A swipe/drag **3D-depth catalogue**: the first card is **All Courses**, followed by real learning domains.
- Previous/next controls as an accessible alternative to drag/swipe.
- Real domain counts derived from the current course response.
- Correct domain navigation to `/courses?category=<domain>`.
- A learning loop: **Learn → Practice → Build → Evolve**.
- Real catalogue course discovery.
- No fake learner totals, fake success rates, fabricated testimonials, or seeded enrollment/rating values presented as public platform achievements.
- Footer intentionally remains a later traversal node.

### Important scalability boundary

The homepage currently derives domains from the `/api/courses` response because the development catalogue is small. This is deliberately a presentation-layer step for the current stage.

At large scale, the homepage must not download millions of courses merely to discover domains. The future architecture should introduce a dedicated, indexed, cached discovery/domain API and pagination/search infrastructure.

## Existing platform capabilities

The repository already contains functionality for:

- Authentication and OAuth
- Student / instructor / admin roles
- Course browsing and course details
- Course creation
- Enrollment and progress tracking
- Reviews and wishlist
- Streaks and leaderboard
- Certificates
- Razorpay payment integration
- AI routes / assistant functionality
- Admin and instructor dashboards

These capabilities are being traversed and rebuilt incrementally rather than discarded blindly.

## Project structure

```text
LearnX/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed-all-courses.js
│   ├── seed-users.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── DEVLOG.md
├── LICENSE
└── README.md
```

## Run locally

### Backend

```powershell
cd C:\Developer\LearnX\backend
npm run dev
```

Expected:

```text
Server running on port 5000
MongoDB Connected
```

### Frontend

Open another terminal:

```powershell
cd C:\Developer\LearnX\frontend
npm run dev
```

Expected:

```text
Local: http://localhost:3000/
```

No new dependency is required for the current homepage/domain-explorer work. The project already includes Framer Motion, React Router, Lucide React, Axios and Tailwind CSS.

## Current homepage/domain data flow

```text
MongoDB Course documents
        ↓
GET /api/courses
        ↓
Homepage course state
        ↓
group by course.category
        ↓
All Courses + learning-domain explorer
        ↓
/courses?category=<encoded category>
        ↓
Courses page reads URL category
        ↓
actual filtered catalogue
```

## Development rules

1. Never invent public platform metrics.
2. Never replace working functionality merely for visual consistency.
3. Check whether a dependency already exists before installing anything.
4. Validate syntax before handing over large generated files.
5. Test locally before committing.
6. Commit coherent milestones so the project always has a safe rollback point.
7. Traverse the application as a tree: inspect the current node and its dependencies before moving to the next node.
8. Keep the product name **LearnX** until an explicit future rename decision is made.
9. Design for expansion: today's six domains must not become tomorrow's architectural limit.
10. Treat AI as a capability inside the platform, not as the only way courses are created.

## Current change package

The current package changes only:

- `frontend/src/components/Homepage.jsx`
- `frontend/src/pages/Courses.jsx`
- `README.md`
- `DEVLOG.md`

No package manifest or lockfile changes are required.

## Verification checklist before commit

- [ ] Homepage loads at `http://localhost:3000/`
- [ ] All Courses is the first explorer card
- [ ] Swipe/drag moves the active card forward/backward
- [ ] Previous/next controls work
- [ ] Domain card counts match the current API data
- [ ] Selecting a domain and pressing Explore opens the correct category URL
- [ ] Courses page filters to that exact category
- [ ] Browse all returns to the complete catalogue
- [ ] Individual course links still open correctly
- [ ] No fake homepage metrics/testimonials appear
- [ ] No Vite/Babel console errors appear
- [ ] Mobile layout is usable
- [ ] `npm run build` succeeds
- [ ] `git diff` contains only intended changes

## License

This project currently uses the repository's custom All Rights Reserved license.
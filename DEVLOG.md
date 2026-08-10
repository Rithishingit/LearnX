# Devlog

This file tracks the major milestones, fixes, and verification steps for the LearnX project.

## 2026-08-10

### Status
- Local frontend and backend are running successfully.
- The app is reachable at http://localhost:3000 and http://localhost:5000.
- MongoDB connectivity is working in the current local setup.


### Technical note
- Payment routes now fail gracefully when Razorpay is not configured, rather than crashing the server.
- This keeps local development usable without requiring payment credentials.

### Next steps
- Test register/login flow end to end.
- Seed sample courses and users for a fuller demo experience.
- Prepare a clean, reviewable commit for the current progress.

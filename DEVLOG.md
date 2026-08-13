# Devlog

This file tracks the major milestones, fixes, design decisions, and verification steps for LearnX.

## 2026-08-13 - Updates Coming...

### Completed

- Confirmed the local LearnX stack runs with Node.js 24.19.0 and npm 11.17.0.
- Confirmed the backend reaches MongoDB locally on port 5000.
- Confirmed the frontend runs on port 3000.
- Removed fabricated homepage marketing metrics and testimonial claims from the homepage direction.
- Replaced the static domain-box concept with data-derived learning discovery.
- Confirmed the current development catalogue contains 30 seeded courses across six development domains.
- Connected domain selection to the course catalogue through the URL category parameter.
- Reworked the domain presentation into a swipe/drag depth carousel.
- Made **All Courses** the first discovery state, followed by learning domains.
- Added previous/next controls so the interaction is not dependent on touch or drag.
- Preserved the existing footer for a later homepage traversal pass.
- Did not add a new npm dependency for the interaction.

### Design decision

The orbit/map prototype was useful as an exploration experiment, but it was not the final LearnX interaction. The product direction is now a depth-based catalogue explorer: one learning surface comes forward while adjacent surfaces recede.

The intention is to create a dynamic product experience without copying another site's code or visual identity.

### Data principle

Seeded development records may be used to exercise application behavior, but seeded enrollment totals, ratings, testimonials, success rates, and similar values must not be presented as real LearnX achievements.

### Scalability note

The current homepage derives domains from the course response because the development dataset is small. This is not the final large-scale architecture. A future discovery API should expose indexed domains, counts, search and pagination independently of the full course collection so the homepage remains viable at very large catalogue sizes.

### Verification status

- Generated JSX was syntax-checked through TypeScript JSX transpilation before packaging.
- Local browser verification is still required after the files are copied into the user's working tree.
- Do not commit until the verification checklist in `README.md` passes.

### Next tree node

After the homepage milestone is committed, stop homepage work for the day. Continue the application traversal from the next agreed node rather than making unrelated global changes.

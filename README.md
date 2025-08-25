# Nova University Admissions (Static HTML/CSS)

A visually polished, accessible academic admissions website suitable for a B.Sc. CS second-year project. Built using only HTML and CSS with semantic markup and CSS-only validation indicators.

## Pages
- `index.html`: Home/landing with hero, programs, timeline, CTA.
- `login.html`: Login form with HTML5 validation.
- `register.html`: Registration form with required fields and pattern validation.
- `dashboard.html`: Applicant dashboard with KPIs and next steps.
- `application.html`: Multi-section application form with required fields.

## How to run
Open `index.html` directly in your browser. No server required.

## Accessibility
- Landmarks: header, main, footer, nav regions.
- Skip link for keyboard users.
- Labels bound via `for`/`id`.
- Descriptive button and link text.

## Validation & Error Handling (Static)
- Uses HTML5 validation (`required`, `type`, `pattern`, `min`, `max`).
- CSS shows `.error` messages when fields are invalid.
- In a real backend, add server-side validation and auth.

## Manual Test Plan

### Home
- Verify navigation links work.
- Resize window: layout remains readable under 360px width.

### Login
- Submit empty form: browser blocks submission and shows invalid fields.
- Invalid email: error message appears.
- Password < 6 chars: error state visible.
- Successful submit should navigate to `dashboard.html` (simulated).

### Register
- Leaving any required field empty should block submit.
- Phone accepts only 10 digits (no spaces/dashes).
- Password and Confirm visually require 6+ chars. (Note: exact matching needs JS; kept static.)
- Program must be selected.

### Dashboard
- Cards display and wrap on mobile.
- Links to Application page work.

### Application Form
- Required fields enforce validity.
- HSC Percentage enforces 35–100, step 0.01.
- Maths Marks 0–100.
- Program must be selected.

## Notes
- Now includes JS validation, password match, drag-and-drop file previews, and localStorage-backed simulated persistence. This remains a static prototype; no real upload occurs.
- You can extend with JS later for password confirm matching and localStorage.

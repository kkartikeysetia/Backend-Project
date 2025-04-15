// Design a URL shortener service that takes in a valid URL and returns a shortened URL, redirecting the user to the previously provided URL.
// Also, keep track of total visits/clicks on the URL.

// Routes
// POST /URL - Generates a new short URL and returns the shortened URL in the format example.com/random-id.
// GET /:id - Redirects the user to the original URL
// GET /URL/analytics/:id - Returns the clicks for the provided short id.

## Summary of Flow

User visits site → Home page served via static route → Shows form.
User submits form → POST /url → Controller saves shortId and URL in DB.
A short ID is generated (like oIY7R9k4u) → shown back on the page.

Visiting localhost:8001/oIY7R9k4u:
Increments visit history
Redirects to original URL

Analytics page shows:
Number of clicks
When those clicks happened

What entities (data) are involved?
What endpoints do I need?
What logic happens at each endpoint?

## How to Train This Thinking?

Start with these 4 questions for any project:

What is the input from the user?
→ e.g., A URL they type in.

What do I want to give back?
→ e.g., A short link like /abc123

What should I do with the input before that?
→ e.g., Check it's valid, generate short code, save in DB.

What should I remember/store?
→ e.g., Save { shortId, originalURL } in DB

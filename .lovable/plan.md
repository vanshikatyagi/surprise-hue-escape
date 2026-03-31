

# MystiGo Platform Overhaul Plan

This is a major feature expansion covering 8 areas: enhanced itineraries, dashboard flow fix, concierge booking section, AI chatbot, user accounts with "Local Secrets", smart integration of local secrets into itineraries, navigation flow fixes, and button consistency.

---

## 1. Enhanced Itinerary Generation

**What changes**: Update the `generate-itinerary` edge function prompt to produce richer day-wise plans.

- Each day gets **Morning, Afternoon, Evening, Night** time blocks instead of arbitrary times
- Prompt additions: hidden gems, local food recommendations, photo-worthy spots, insider tips per activity
- Add fields: `hidden_gem: boolean`, `photo_spot: boolean`, `local_food_tip: string` to each activity in the JSON schema
- Update `TripReveal.tsx` and `ItineraryView.tsx` to render these new fields with visual badges (camera icon for photo spots, sparkle for hidden gems, fork for food tips)

## 2. Dashboard "Generate Itinerary" Flow Fix

**What changes**: When user clicks "Generate Itinerary" in Dashboard, show a modal/dialog first instead of navigating away.

- Create `GenerateItineraryDialog.tsx` — a dialog with:
  - Destination input (mandatory)
  - Optional: budget dropdown, vibe multi-select, duration selector
- On submit, navigate to `/reveal` with this data (bypassing quiz)
- Update `Dashboard.tsx` to use this dialog instead of `navigate("/itinerary")`

## 3. "Plan Your Personalized Trip" Concierge Section

**What changes**: Replace the "Start Your Mystery" booking form at bottom of Index page.

- Rename heading to "Plan Your Personalized Trip"
- Simplify form to: Name, Email, Preferences (textarea)
- On submit: insert into `bookings` table with `status: 'pending'`
- Show success message: "Our travel expert will personally connect with you to craft your perfect trip"
- Add "Request a Call Back" button that opens WhatsApp/email link
- **Database**: Add `contact_type` column to `bookings` table (values: 'mystery_trip', 'concierge_request', 'callback')

## 4. AI Travel Chatbot

**What changes**: Build a floating chatbot component, completely separate from the quiz.

- Create new edge function `supabase/functions/travel-chat/index.ts` using Lovable AI (streaming)
- System prompt: "You are MystiGo's travel assistant. Suggest destinations, give mini itinerary previews, share travel tips. Never ask quiz-style preference questions."
- Create `src/components/TravelChatbot.tsx`:
  - Floating button (bottom-right corner)
  - Opens chat panel with quick action buttons: "Surprise Me", "Hidden Gems", "Weekend Plan", "Trending Places"
  - Streaming AI responses
  - "Talk to Travel Expert" button that scrolls to concierge section
- Add chatbot to `Index.tsx` and `Dashboard.tsx`

## 5. User Accounts + "Local Secrets" Feature

**What changes**: New database table and UI for community-contributed travel secrets.

- **Database migration**: Create `local_secrets` table:
  - `id`, `user_id` (ref auth.users), `location` (text), `title`, `description`, `category` (enum: hidden_place, food_spot, local_tip, less_crowded), `image_url` (nullable), `created_at`
  - RLS: authenticated users can insert their own, everyone can read
- Create `src/pages/LocalSecrets.tsx` — browse page with cards showing community secrets filtered by location
- Add "Add Local Secret" form (dialog or dedicated page) for logged-in users
- Add route `/local-secrets` in `App.tsx`
- Add navigation link in Header and Dashboard

## 6. Smart Integration — Local Secrets in Itineraries

**What changes**: When generating itineraries, query `local_secrets` table for the destination and include them.

- In `generate-itinerary` edge function: accept optional `local_secrets` array in request body
- In `TripReveal.tsx`: after destination is chosen, fetch matching local secrets from DB and pass them to the itinerary generation call
- The AI prompt will include: "Community members have shared these local tips for {destination}: ..." and instruct the AI to weave them into the itinerary
- Display local secret activities with a special "Community Pick" badge

## 7. Navigation Flow Fixes

**What changes**: Ensure consistent navigation across the app.

- "Book Now" / "Book Mystery Trip" buttons → scroll to quiz section (already done)
- Dashboard "New Booking" button → scroll to concierge section on homepage
- All CTA buttons that say "Book" go to quiz, not direct booking
- Add smooth scroll handler for cross-page navigation (already partially implemented)

## 8. Button Consistency Audit

**What changes**: Review and fix every button across all pages.

- "Generate Itinerary" → opens dialog (not auto-generate)
- "Book Flight" / "Book Hotel" → navigates to respective pages
- "Start Your Journey" → scrolls to quiz
- "Subscribe" newsletter → opens dialog
- Remove any buttons that auto-trigger actions without user confirmation

---

## Database Migrations Required

1. Add `contact_type` column to `bookings` table
2. Create `local_secrets` table with RLS policies
3. Enable realtime on `local_secrets` (optional, for live updates)

## New Files

| File | Purpose |
|------|---------|
| `src/components/TravelChatbot.tsx` | Floating AI chatbot |
| `supabase/functions/travel-chat/index.ts` | Chatbot edge function |
| `src/components/GenerateItineraryDialog.tsx` | Dashboard itinerary input dialog |
| `src/pages/LocalSecrets.tsx` | Community local secrets page |
| `src/components/AddLocalSecretForm.tsx` | Form to add local secrets |

## Modified Files

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Replace booking section with concierge, add chatbot |
| `src/pages/Dashboard.tsx` | Fix generate itinerary flow, add local secrets link |
| `src/pages/TripReveal.tsx` | Enhanced activity rendering, local secrets integration |
| `src/pages/ItineraryView.tsx` | Enhanced activity rendering with new fields |
| `src/components/Header.tsx` | Add Local Secrets nav link |
| `src/App.tsx` | Add `/local-secrets` route |
| `supabase/functions/generate-itinerary/index.ts` | Enhanced prompt with time blocks, hidden gems, local secrets |

## Implementation Order

1. Database migrations (local_secrets table, bookings update)
2. Enhanced itinerary generation (edge function + UI)
3. Concierge section replacement
4. Dashboard flow fix
5. AI Chatbot (edge function + component)
6. Local Secrets page + form
7. Smart integration of local secrets into itineraries
8. Navigation + button audit


# 14 — Content and Assets

## 1. Voice

Joko sounds like a knowledgeable friend who loves cinema: warm, specific, and calm. Never breathless, never corporate, never cute.

- **Specific over generic.** “Today, 7:20 PM · The Meridian · Screen 1” beats “Your upcoming show”.
- **Sentence case.** Buttons, titles, tabs, section headers.
- **Short.** One idea per sentence. Two lines maximum for helper copy.
- **Confident.** “You’re booked.” not “Payment successful!”.
- **No emoji in UI chrome.** No exclamation marks in confirmation copy.
- **No jargon.** “Cinema”, “showtime”, “screen”, “seat”, “ticket”.
- **No fake urgency.** “Few left” only when true; no countdown pressure.

---

## 2. Terminology

| Use | Do not use |
|---|---|
| Cinemas | Theatres, Movie Theaters |
| Book tickets | Book seat, BOOK SEAT |
| Showtime | Show time, session |
| Screen / Auditorium | Hall |
| Seats | Seat options |
| Payment | PAYMENT, checkout (as a title) |
| Review order | Make payment (for the review screen) |
| View ticket | Download seat details |
| Saved films | Favorite Movies |
| Coming soon | Upcoming (for unreleased films) |
| Few left | Almost gone |
| Sold out | Unavailable (for a showtime) |
| Booking reference | Order ID |

---

## 3. Copy deck

### 3.1 Home

- Greeting: “Good evening, Joshua” (time-aware; no emoji).
- Featured chip: “Joko pick”.
- Hero CTA: “Book tickets”.
- Hero secondary: “Details”.
- Upcoming strip: “Today · 7:20 PM · The Meridian”.
- Section titles: “Popular this week”, “New releases”, “Coming soon”, “Because you love sci-fi”, “Cinemas near you”.
- See all: “See all”.
- Empty: “New films are on the way.” / “Browse cinemas”.
- Error: “We couldn’t load what’s showing. Check your connection.” / “Try again”.
- Offline: “You’re offline. Showing saved information.”

### 3.2 Movies

- Overline: “Your next great story”.
- H1: “Find your film.”
- Subtitle: “Good stories. The best seat in the house.”
- Search: “Search films or genres”.
- Segments: “All”, “Now showing”, “Coming soon”.
- Filters: “Filters”, “Clear all”, “Show 12 films”.
- Empty: “No films match those filters.” / “Try removing a filter or searching for something else.” / “Clear filters”.
- Footer: “14 films · All showtimes in local time”.

### 3.3 Search

- H1: “Search Joko.”
- Placeholder: “Films, cinemas or areas”.
- Section: “A good place to start”.
- Prompts: “Tonight near me”, “Something new”, “A little adventure”, “Easy date night”.
- No results: “No matches for “{query}”.” / “Try a film title, a genre, or a cinema.” / “Clear search”.

### 3.4 Movie detail

- Overline: “The film everyone’s talking about” (only when true).
- Score labels: “Audience score”, “Joko score”, “Critic score”.
- CTAs: “Book tickets”, “Watch trailer”.
- Sticky: “Tickets from ₦7,500” / “Next: Today, 7:20 PM · The Meridian”.
- Tabs: “About”, “Showtimes”, “Cast”, “Reviews”.
- Story: “The story”, “More about the film”.
- Cast: “The cast”, “See all”.
- Trailer: “Watch the trailer”, “All clips”.
- Reviews: “Audience reviews”, “Based on 128 ratings”, “See all reviews”, “Helpful 12”, “Report”.
- No showtimes: “No showtimes yet.” / “See other films”.

### 3.5 Cinemas

- H1: “Pick your cinema.”
- Subtitle: “Great screens and an easy way there.”
- Search: “Search cinemas or areas”.
- Sort: “Distance”, “Price”, “Rating”.
- Filters: “Near me”, “Today”, “Under 5 km”, “IMAX”, “Open now”, “Recliner”, “Parking”, “Food”, “Accessible”.
- Empty: “No cinemas match those filters.” / “Clear filters”.
- Location denied: “Location is off. Showing Victoria Island.” / “Turn on” / “Change area”.

### 3.6 Cinema detail

- CTA: “See showtimes”.
- Actions: “Directions”, “Call”, “Website”, “Share”.
- Showtimes: “No showtimes on this day.” / “Choose another day”.
- About: “About”, “More”, “Venue details”.
- Reviews: “See all reviews”.

### 3.7 Booking

- Steps: “Date & time”, “Seats”, “Payment”.
- Date: “Choose a day”, “Pick the night that works for you.”, “All times are local to Victoria Island.”
- Formats: “2D”, “3D”, “IMAX”, “Dolby”.
- Availability: “Good availability”, “Filling up”, “Almost full”.
- Seats: “Choose your seats”, “Every seat is a good seat.”, “Pick your seats — tap any available seat.”
- Max seats: “Up to 8 seats per booking.”
- Best available: “Best available”.
- Selection: “3 seats · E5, F6, A2”.
- Continue: “Continue”.
- Review: “Review order”, “Your movie night”, “Have a promo code?”, “Free cancellation up to 2 hours before showtime.”, “Continue to payment”.
- Promo error: “That code isn’t valid. Check the spelling and try again.”
- Payment: “How would you like to pay?”, “Your ₦26,800 ticket is one step away.”, “Card”, “Transfer”, “Wallet”, “Pay ₦26,800”.
- Security: “Encrypted and secure. Joko never stores your card details.”, “You may be asked to verify with your bank.”
- Failure: “Your payment didn’t go through. No charge was made.” / “Try again”.
- Success: “Booking confirmed”, “You’re booked.”, “A happy cinema night, with a ticket that’s right here when you need it.”, “Saved to Tickets.”, “View ticket”, “Share ticket”, “Done — back to Home”.

### 3.8 Tickets

- H1: “Your tickets.”
- Subtitle: “Everything you’ve booked, in one place.”
- Segments: “Upcoming”, “Past”.
- Countdown: “Starts in 2 hours”, “Starts in 2 days”.
- Empty upcoming: “No tickets yet.” / “When you book a seat, your ticket will live here.” / “Browse movies”.
- Empty past: “No past nights yet.” / “Your cinema history will appear here.”
- Cancel: “Cancel booking”, “Free cancellation up to 2 hours before showtime.”
- Past: “Attended”, “Cancelled”.

### 3.9 Account

- H1: “Your account.”
- Sections: “Your Joko”, “Support & settings”.
- Rows: “Saved films”, “Payment methods”, “Booking history”, “Preferences”, “Help & support”, “Privacy & security”, “About Joko”, “Sign out”.
- Appearance: “System”, “Light”, “Dark”.
- Sign out: “Sign out of Joko?” / “Cancel” / “Sign out”.

---

## 4. Empty, error, and offline patterns

| Situation | Copy |
|---|---|
| No films | “New films are on the way.” + `Browse cinemas` |
| No filter results | “No films match those filters.” + `Clear filters` |
| No cinemas | “No cinemas in this area yet.” + `Change area` |
| No showtimes | “No showtimes on this day.” + `Choose another day` |
| Sold out | “This showtime is sold out.” + `Choose another time` |
| No seats | “Pick your seats — tap any available seat.” |
| Max seats | “Up to 8 seats per booking.” |
| Payment declined | “Your payment didn’t go through. No charge was made.” + `Try again` |
| Timeout | “This is taking longer than usual. Check your connection and try again.” |
| Offline | “You’re offline. Showing saved information.” + `Retry` |
| Ticket not found | “We couldn’t find that ticket.” + `Go to Tickets` |
| Booking not found | “We couldn’t find that booking.” + `Browse movies` |
| Save failed | “We couldn’t save your ticket.” + `Retry` |

Never use “Oops”, “Uh-oh”, “Something went wrong” alone, or a dead end.

---

## 5. Review content

Write 6–8 reviews per film with:

- A first name and initial (“Amara O.”).
- A rating (1–5), distributed realistically.
- A date within 90 days.
- 1–4 sentences, varied tone: one enthusiastic, one measured, one critical but fair, one about the venue, one about a specific scene.
- No repeated phrases, no “Helpful 12” on every card.
- No real people or celebrity names.

Example set for The Green Room:

> **Amara O.** ★★★★★ · 8 Nov
> The world-building stayed with me. Give yourself the big screen and let it unfold.
>
> **Daniel K.** ★★★★ · 3 Nov
> A terrific lead and a wonderful score. The second act runs a little long, but the ending earns it.
>
> **Tolu A.** ★★★★ · 28 Oct
> Saw it at The Meridian. The recliner seats and the sound made the quiet scenes land harder. Booking was easy.
>
> **Ifeoma N.** ★★★ · 21 Oct
> Beautiful to look at, though the supporting cast felt underused. Still worth a cinema trip.
>
> **Bode F.** ★★★★★ · 14 Oct
> I went in knowing nothing and left wanting to watch it again. That final shot is a stunner.
>
> **Grace E.** ★★★★ · 2 Oct
> A slow burn, in the best way. The 7:20 PM show was full but the seats were comfortable and the queue moved fast.

---

## 6. Asset inventory

### 6.1 Brand

| Asset | Spec | Notes |
|---|---|---|
| `assets/brand/popcorn.png` | Transparent, 3x of 92×92 | White mark from the canonical splash |
| `assets/brand/wordmark.png` | Transparent, 3x of 168×48 | “Joko” wordmark, exact lettering |
| `assets/brand/wordmark-small.png` | Transparent, 3x of 96×28 | Home header |
| `assets/splash.png` | 660×900, transparent lockup | Composite popcorn + wordmark, centered on the `#280056` background |
| `assets/icon.png` | 1024×1024 | App icon, plum background, white mark |
| `assets/adaptive-icon.png` | 1024×1024, safe zone | Android adaptive icon |
| `assets/favicon.png` | 48×48 | Web only |

**Current problem:** `assets/splash.png` is a white image with a small purple popcorn roundel and no wordmark. Replace it. The canonical reference is `joko-screens/old/Splash Screen - 1.jpg`.

### 6.2 Mock imagery

| Asset | Spec | Count |
|---|---|---|
| Posters | 2:3, 600×900, original art | 14 |
| Backdrops | 3:4, 900×1200, original art | 14 |
| Cinema photos | 1:1, 400×400 | 8 |
| Cinema gallery | 16:9, 1200×675 | 3–5 per cinema |
| Cast avatars | 1:1, 200×200 or initials | 6–8 per film |
| Trailer thumbnails | 16:9, 800×450 | 1–2 per film |
| Static map | 3:2, 1200×800 | 1 |

- Use original, neutral artwork. No real film posters, logos, stills, or celebrity likenesses.
- Posters can be abstract/illustrative; they must look intentional, not like gray placeholders.
- Keep a consistent art direction: cinematic lighting, limited palette, no text on the poster except the title.
- Store locally in `assets/mock/` for MVP. If remote, use `expo-image` with a blurhash/placeholder.

### 6.3 Icons

- Ionicons for UI, MaterialCommunityIcons for seat/amenity glyphs.
- Do not mix families within one surface.
- Export no custom icon fonts; use the vector icon packages.

---

## 7. Image guidelines

- Every image has a placeholder (`surface+1` + shimmer) and a 150 ms transition.
- Use `contentFit="cover"` for posters/backdrops; `contain` only for logos/marks.
- Scrims are plum/near-black gradients, never colored.
- Text over imagery must sit on a scrim with ≥ 4.5:1 contrast.
- Avoid text baked into images; titles belong in the UI.
- Provide `accessibilityLabel` for meaningful images; hide decorative ones.

---

## 8. No third-party trademarks

- No Rotten Tomatoes, IMDb, Metacritic logos, letters, or lookalike badges.
- No real film titles, posters, or celebrity names.
- No real cinema chain logos. Cinema names are fictional.
- No Paystack/Flutterwave/Apple Pay/Google Pay logos unless using their official brand assets under their guidelines; for MVP, use plain text labels and generic icons. If a provider mark is required, use the official asset and follow the provider’s brand rules.
- The Joko wordmark and popcorn mark are the only brand marks in the UI.

---

## 9. Localization readiness

- All strings live in `src/content/strings.ts` (or a typed copy module), not inline in components.
- Use `Intl` for dates, times, and currency.
- Avoid concatenating sentences with variables; use placeholders.
- Allow 30% text expansion; test German-like long strings if localizing.
- Do not bake copy into images.
- RTL is not in MVP, but avoid absolute left/right assumptions where cheap to avoid.

---

## 10. Content acceptance

- [ ] All UI copy is sentence case (except one optional overline).
- [ ] No emoji in UI chrome.
- [ ] No third-party marks or real film assets.
- [ ] Empty/error/offline copy says what happened and what to do.
- [ ] Reviews are varied and realistic.
- [ ] Prices and times are specific.
- [ ] The splash asset is the canonical plum lockup.
- [ ] App icon and adaptive icon use plum, not white.
- [ ] Every image has a placeholder and alt text where meaningful.
- [ ] Strings are centralized and ready for localization.

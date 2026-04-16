# E-commerce Industry Rules (20 Rules)

## Overview
E-commerce is about conversion: reduce friction, build trust, and clear the path to purchase. Users are decision-making but impatient.

---

## Recommended Patterns (5 Rules)

### 1. Product Page with Clear Hierarchy
- **Pattern**: Hero image → product title → price/rating → description → size/color options → add to cart
- **Rationale**: Users need to make quick decisions
- **Key Info**: Price, availability, shipping time, reviews above fold
- **Images**: Multiple angles, zoom capability, alt text for accessibility
- **CTAs**: "Add to Cart" (primary), "Add to Wishlist" (secondary)

### 2. Checkout Flow (Multi-Step or Single-Page)
- **Pattern**: Cart → Shipping → Payment → Order confirmation
- **Progress Indicator**: Show steps (1/3, 2/3, 3/3)
- **Rationale**: Users want to know where they are
- **Guest Checkout**: Always offer; don't force account creation
- **Security**: Show SSL badge, trust indicators
- **Error Recovery**: Clear validation messages; don't lose cart on error

### 3. Product Filtering & Search
- **Pattern**: Sidebar filters (category, price range, rating) + search bar
- **Rationale**: Users browse or search; support both
- **Facets**: 3–5 most relevant (category, price, rating, color)
- **Mobile**: Collapsible or bottom sheet
- **Results Count**: "Showing 24 of 156 results"
- **Sorting**: By popularity, price (low→high), rating, newest

### 4. Customer Reviews & Ratings
- **Pattern**: Star rating (0–5) + verified purchase badge + review text
- **Rationale**: Social proof drives conversion (especially for unknown brands)
- **Sorting**: Helpful > Recent > Top rating
- **Photos**: Allow customer-uploaded images (builds trust)
- **Response**: Seller/brand response to negative reviews (shows engagement)

### 5. Abandoned Cart Recovery
- **Pattern**: Save cart for 30 days; email/SMS reminder with link
- **Rationale**: Recover ~30% of abandoned carts
- **Incentive**: Optional discount code ("15% off your next purchase")
- **Ease**: One-click restore cart, no re-entry of items
- **Frequency**: Day 1, day 3, day 7 (adjust based on product type)

---

## Style Priorities (5 Rules)

### 6. Urgency Without Deception
- **Priority**: Encourage purchase without fake scarcity
- **Patterns**: "Only 3 left in stock" (if true), "4.8★ from 250 reviews"
- **Colors**: Accent colors (orange, red) for CTAs, but not false urgency
- **Language**: "Sale ends in 2 hours" only if honest
- **Avoid**: Fake countdown timers, fake reviews

### 7. Trust Through Social Proof
- **Priority**: Reduce buyer's remorse; show others have purchased
- **Logos**: "Trusted by X users", brand partnerships, awards
- **Reviews**: Detailed, with photos, verified purchase badges
- **Ratings**: Star ratings, review counts prominently displayed
- **Testimonials**: Video testimonials from real customers (if authentic)

### 8. Contrast & Visual Hierarchy
- **Priority**: Clear product focus; secondary info is supporting
- **CTA Button**: High contrast (orange, bright color), large (44px+ tall)
- **Price**: Large, bold, primary color
- **Secondary Info**: Smaller, gray text (stock, returns policy)
- **Images**: Hero image 70–80% of viewport width

### 9. Mobile Optimization
- **Priority**: 50%+ of traffic is mobile; design for thumb reach
- **Buttons**: 44px+ height, thumb-friendly thumb placement (bottom corners)
- **Tap Targets**: 48px× 48px minimum
- **Scroll**: Minimize horizontal scrolling
- **Checkout**: One column, large inputs, mobile payment (Apple Pay, Google Pay)

### 10. Fast, Smooth Performance
- **Priority**: Every 100ms delay = 1% conversion loss
- **Images**: Optimize, lazy-load below fold
- **JS**: Code-split, avoid render-blocking scripts
- **Animations**: Only if <200ms; disable on slow devices (prefers-reduced-motion)
- **Indicator**: Show loading spinner if checkout > 2 seconds

---

## Color Moods (3 Rules)

### 11. Action & Energy (Orange/Red)
- **Primary CTA**: #f97316, #ef4444, #fb923c
- **Psychology**: Energy, urgency, action
- **Use Cases**: "Add to Cart", "Buy Now", sale badges
- **Caution**: Don't overuse; should stand out from background

### 12. Trust & Confidence (Blue)
- **Secondary**: #2563eb, #0ea5e9, #0284c7
- **Psychology**: Trust, stability, security
- **Use Cases**: Account login, "Secure Checkout", shipping info
- **Example**: Lock icon in blue for "Secure Payment"

### 13. Value & Savings (Green)
- **Accent**: #10b981, #16a34a, #059669
- **Psychology**: Savings, growth, positive outcomes
- **Use Cases**: Price drops, discounts, "Save $50", stock availability
- **Example**: "-$50 (20% off)" in green

---

## Typography Personality (3 Rules)

### 14. Product-Focused Clarity
- **Headline**: Inter, Montserrat, or Roboto (modern, energetic)
- **Body**: Lato, Open Sans (clear, approachable)
- **Size**: 16px+ for product details (not too small)
- **Weight**: Bold for prices, titles; regular for descriptions
- **Rationale**: E-commerce is about quick decisions; clarity > brand personality

### 15. Scannable Product Descriptions
- **Bullet Points**: Feature lists (not paragraphs)
- **Short Lines**: Max 60 characters for easy scanning
- **Emphasis**: Bold key features ("Ships in 2 days", "Free returns")
- **Avoid**: Marketing fluff; be factual

### 16. Trust-Building Microcopy
- **Labels**: "Free shipping on orders over $50" (build value)
- **CTAs**: "Add to Cart" (not "Submit", "OK")
- **Confirmations**: "✓ Added to cart. View cart or continue shopping"
- **Errors**: Specific ("Email address already in use" not "Error")

---

## Key Effects (2 Rules)

### 17. Smooth Cart & Checkout Interactions
- **Add to Cart**: Confirmation toast, slide-in notification
- **Quantity**: +/− buttons, instant update to total price
- **Wishlist**: Heart icon, toggle on/off (save state)
- **Loading**: Spinner for payment processing
- **Success**: Order confirmation page + email

### 18. Image & Product Interactions
- **Hover**: Color swatch changes product image instantly
- **Zoom**: Click to zoom; pinch to zoom on mobile
- **Gallery**: Thumbnail navigation; keyboard arrows on desktop
- **Transition**: 200ms fade-in for image changes

---

## Anti-Patterns (2 Rules)

### 19. What to Avoid in E-commerce

❌ **Forced Account Creation**
- **Why**: Users abandon cart; friction increases
- **Instead**: Guest checkout first; optional account post-purchase

❌ **Hidden Costs (Shipping, Fees) Until Checkout**
- **Why**: Surprise costs = cart abandonment, negative reviews
- **Instead**: Show total price upfront, itemize fees early

❌ **Fake Scarcity ("Only 1 left!" for every product)**
- **Why**: Erodes trust; feels manipulative
- **Instead**: Only show if genuinely low stock (verify backend)

❌ **Auto-Play Videos, Music**
- **Why**: Frustrates users; unexpected noise
- **Instead**: Muted by default; manual play required

### 20. Hard-to-Find Return Policy
- **Why**: Reduces confidence in purchase
- **Instead**: Link in footer + on product page
- **Clear**: Specify window (30 days), condition (unused), process (free shipping?)

---

*Last Updated: 2026-04-16*
*Rules Count: 20*

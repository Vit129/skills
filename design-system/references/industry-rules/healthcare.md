# Healthcare Industry Rules (20 Rules)

## Overview
Healthcare products prioritize patient safety, empathy, accessibility, and data privacy (HIPAA). Users include patients, caregivers, and medical professionals with varying tech literacy.

---

## Recommended Patterns (5 Rules)

### 1. Patient Timeline or Health Journey
- **Pattern**: Chronological view of events (appointments, prescriptions, test results)
- **Best For**: EHR, telemedicine, patient portals
- **Structure**: Vertical timeline, icons for event type, expandable details
- **Filter**: By date range, category (tests, visits, prescriptions)
- **Accessibility**: Screen-reader friendly; timestamps clear

### 2. Medication Lists with Clear Instructions
- **Pattern**: Table with medication name, dosage, frequency, reason, refill status
- **Rationale**: Confusion about medications can cause harm
- **Include**: Side effects, interactions warning, pharmacy contact
- **Reminder**: Optional notification for missed doses
- **Accessibility**: Print-friendly format for offline reference

### 3. Appointment Booking with Confirmation
- **Pattern**: Date/time picker → specialist selection → reason → confirmation
- **Rationale**: Reduces no-shows, ensures proper scheduling
- **Best For**: Clinics, telemedicine platforms
- **Confirmation**: Email + SMS with appointment details, directions, preparation tips
- **Cancellation**: Clear policy, minimum notice requirement

### 4. Symptom Checker (Guided Q&A)
- **Pattern**: Decision tree with yes/no questions → severity assessment → recommendations
- **Disclaimer**: "Not a diagnosis; consult a doctor"
- **Recommendation**: Urgent care / ER / home care / schedule visit
- **Next Step**: Link to book appointment or call hotline
- **Accessibility**: Large text, high contrast, simple language

### 5. Health Data Visualization (Charts with Context)
- **Pattern**: Blood pressure, heart rate, weight trends as line/bar charts
- **Rationale**: Patients need to see trends, understand their progress
- **Annotations**: Medication changes, lifestyle events marked
- **Sharing**: Export as PDF or image for doctor
- **Interpretation**: AI-generated insight ("Your BP is trending down") + disclaimer

---

## Style Priorities (5 Rules)

### 6. Empathy & Reassurance
- **Priority**: Calm, supportive tone; reduce anxiety
- **Colors**: Soft blues, warm earth tones; avoid alarming reds except for emergencies
- **Imagery**: Diverse, inclusive photos of real patients (not stock photos)
- **Language**: Patient-friendly (avoid medical jargon; explain terms)
- **Spacing**: Generous whitespace; doesn't feel cramped

### 7. Accessibility First
- **Priority**: WCAG AAA (not just AA) for inclusivity
- **Text Size**: 16px+ for body, support 200% zoom
- **Color Contrast**: 7:1 for critical content
- **Motor**: Large touch targets (48px+), no time-dependent interactions
- **Cognitive**: Plain language, simple navigation, consistent patterns

### 8. Trust Through Transparency
- **Priority**: Be honest about limitations, risks, privacy
- **Disclaimers**: Always visible for medical advice/AI recommendations
- **Data Privacy**: Explain what data is collected, how it's used (HIPAA compliance)
- **Contact Info**: Always provide phone number or live chat for urgent questions
- **Branding**: Medical logos, credentials, certifications visible

### 9. Mobile-First Design
- **Priority**: Many patients access via phone (especially for urgent care)
- **Breakpoints**: 320px (small phone), 768px (tablet)
- **Touch**: Large buttons (44px+), swipe to navigate
- **Offline**: Critical info (medications, appointments) available without internet
- **Readability**: Vertical stack, large fonts

### 10. Calm, Minimal Aesthetic
- **Priority**: Reduce cognitive load; reduce anxiety
- **Elements**: Remove unnecessary decorations, ads, distractions
- **Animation**: Avoid auto-play videos, flashing content
- **Colors**: Soft palette; no bright, aggressive colors
- **Typography**: Serif for body (easier to read for older users), clear sans for labels

---

## Color Moods (3 Rules)

### 11. Trust & Care (Soft Blue)
- **Primary**: #4a90e2, #50c878, #87ceeb
- **Psychology**: Healing, professionalism, calm
- **Use Cases**: Primary CTA, patient dashboard, appointment scheduling
- **Avoid**: Bright, saturated blues (too clinical)

### 12. Health & Wellness (Green)
- **Accent**: #10b981, #50c878, #7cb342
- **Psychology**: Growth, healing, vitality
- **Use Cases**: Positive health metrics, wellness tips, preventive care
- **Example**: "Your exercise goal: 7/7 days completed" in green

### 13. Caution & Urgency (Orange/Red)
- **Alert**: #f97316, #ef4444
- **Psychology**: Attention, warning
- **Use Cases**: Allergy warnings, medication interactions, urgent symptoms
- **Reserve**: Red only for true emergencies; orange for caution

---

## Typography Personality (3 Rules)

### 14. Clear, Accessible Fonts
- **Headline**: Merriweather (serif) or Source Sans (modern, trustworthy)
- **Body**: Georgia or Roboto (highly readable, even at small sizes)
- **Monospace**: Not used (medical context doesn't require code)
- **Rationale**: Serif is traditional (medical); sans is modern (tech)

### 15. Patient-Friendly Language
- **Jargon-Free**: Avoid medical terminology; explain concepts simply
- **Consistency**: Define terms once, use same term throughout
- **Length**: Short sentences, paragraphs 3–4 sentences max
- **Example**: "Blood pressure: The force of blood pushing on artery walls" (explain)

### 16. Hierarchical Information
- **h1**: Page title (e.g., "My Appointments")
- **h2**: Section headers (e.g., "Upcoming Visits")
- **Bold**: Medication names, dates, important values
- **Caption**: Dosage, frequency, next review date (smaller, gray)

---

## Key Effects (2 Rules)

### 17. Reassuring Feedback
- **Confirmation**: "✓ Appointment booked for March 15, 2:00 PM"
- **Loading**: Spinner with reassuring text ("Connecting to your provider...")
- **Success**: Soft animation, positive message
- **Error**: Clear explanation of problem + solution
- **Duration**: No instant confirmations (feels untrustworthy); 1-2 second feedback

### 18. Gentle Transitions
- **Duration**: 200–300ms (not too fast, not slow)
- **Easing**: ease-out (natural, calming)
- **Avoid**: Jarring animations, auto-play content
- **Example**: Fade-in for appointment details (not slide-in)

---

## Anti-Patterns (2 Rules)

### 19. What to Avoid in Healthcare

❌ **Medical Advice Without Disclaimer**
- **Why**: Legal liability; patient safety risk
- **Instead**: "This is not medical advice. Consult your doctor." Always visible

❌ **Confusing Medication Instructions**
- **Why**: Patient may take wrong dose or frequency
- **Example**: "Take 1–2 tablets as needed" is ambiguous; "Take 1 tablet every 8 hours (max 2 tablets/day)" is clear
- **Instead**: Specific dosage, frequency, conditions

❌ **Hidden Privacy or Data Sharing**
- **Why**: HIPAA violation; erodes trust
- **Instead**: Transparent privacy policy; explicit consent for data sharing

❌ **No Emergency Contact**
- **Why**: Patient may not know who to call in crisis
- **Instead**: Visible hotline, emergency info on every page

### 20. Time-Sensitive Actions Without Warning
- **Why**: Patient may accidentally cancel appointment, delete records
- **Example**: "Are you sure?" is insufficient; show details
- **Instead**: Modal with appointment date/time + confirm button

---

*Last Updated: 2026-04-16*
*Rules Count: 20*

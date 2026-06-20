Automated E2E Testing for Booking.com with Playwright
I built a Playwright test suite that automates a complete booking flow on Booking.com:

🔍 Search for a destination (Munnar)  
📅 Select random future dates  
👨‍👩‍👧 Configure occupancy (2 adults + 1 child + 2 rooms)  
🏨 Click first property → Verify Overview section  
✅ Click Reserve

Tech Stack: Playwright v1.60 | Page Object Model | JavaScript  
Key challenge: Booking.com's UI changed dynamically after destination selection (auto-opened date picker). Had to adapt locators and handle popup windows for property pages.


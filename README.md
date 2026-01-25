# LibSys - Library Book Borrowing System

![Status](https://img.shields.io/badge/Status-Complete-success)
![Language](https://img.shields.io/badge/Language-Vanilla%20JS-yellow)

## 1. Project Objective
This project demonstrates the application of core JavaScript concepts to solve a real-world problem: **Managing a Library's Daily Operations**. It allows librarians to manage books, register borrowers, and handle book loans/returns in a single interactive interface.

## 2. Project Scope
- **Fully Functional Main Page**: A complete Single Page Application (SPA) dashboard.
- **Real-Life Scenario**: Handles inventory tracking (`Available` vs `Out of Stock`) and borrower loan limits.
- **Dynamic Interactions**: No page reloads; all actions update the DOM immediately.

## 3. Technical Implementation
This project was built from scratch without frameworks, strictly adhering to the requirements:

| Requirement | Implementation Detail |
| :--- | :--- |
| **DOM Manipulation** | Dynamic table generation, View switching, Toast notifications. |
| **Event Handling** | Form `submit` events, button `click` handlers. |
| **Input Validation** | Prevents empty fields, duplicate IDs, and invalid numbers. |
| **Functions & Logic** | Modular architecture (`login`, `render`, `update`). |
| **Data Handling** | `appState` object with functional arrays for `books`, `borrowers`, `loans`. |

## 4. Functional Requirements Checklist
- [x] **Input Validation**: All forms check for valid input before processing.
- [x] **Data Integrity**: Prevents duplicate Borrower IDs and loaning unavailable books.
- [x] **Dynamic Updates**: Dashboard stats and tables update instantly.
- [x] **User Feedback**: Toast notifications for success/error messages.

## 5. How to Run Locally
1. Clone the repository.
   ```bash
   git clone <repository-url>
   ```
2. Open `index.html` in your browser.
   *(No `npm install` or build server required)*

## 6. Deployment
This project is ready for deployment on **Netlify** or **Vercel**:
1. Push code to GitHub.
2. Link repository to the hosting platform.
3. Deploy!

## License
Educational Project.

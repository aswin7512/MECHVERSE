Here are the complete `README.md` and `LICENSE.txt` files for the Mechverse repository.

### `README.md`

````markdown
# Mechverse ⚙️

> **Ignite the Gears of Innovation**

Mechverse is a modern, high-performance web application built to manage registrations and showcase events for a mechanical engineering tech fest. It features a sleek, cyberpunk-inspired UI, smooth animations, and a fully integrated backend for seamless participant registration and event tracking.

## 🚀 Features

* **Immersive UI/UX:** Built with a dark, high-contrast mechanical theme using Tailwind CSS and smooth page transitions powered by Framer Motion.
* **Dynamic Splash Screen:** A visually engaging initialization sequence that welcomes users to the platform.
* **Event Categories:** Dedicated portals for Technical (e.g., Robo Wars, CAD Modeling) and Non-Technical (e.g., Treasure Hunt, Gaming) events.
* **Comprehensive Registration System:** * Collects detailed participant data (Name, College, Class, Semester, KTU ID, etc.).
    * Calculates total fees dynamically based on selected events.
* **Integrated Payment Flow:** Built-in UI for UPI QR code scanning and transaction ID submission for manual verification.
* **Supabase Backend:** Real-time database integration for fetching event details and storing participant registrations securely.
* **Admin Dashboard:** Protected routes for administrators to log in and manage registrations.

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 + Vite
* **Routing:** React Router v7
* **Styling:** Tailwind CSS v4 + Tailwind Merge + clsx
* **Animations:** Framer Motion (Motion v12)
* **Icons:** Lucide React
* **Backend & Database:** Supabase (PostgreSQL)
* **Language:** TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [Supabase](https://supabase.com/) account and project.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/mechverse.git](https://github.com/yourusername/mechverse.git)
   cd mechverse
````

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add your Supabase project credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup:**
    Ensure your Supabase database has the following tables configured:

      * `events` (id, title, type, fee)
      * `registrations` (id, name, college, student\_class, semester, ktu\_id, phone, email, transaction\_id, events array, total\_amount, status)

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```text
src/
├── components/       # Reusable UI components (Layout, etc.)
├── lib/              # Utility functions and Supabase client configuration
├── pages/            # Page components (Home, Events, Registration, Admin)
├── App.tsx           # Main application routing and Splash Screen logic
├── main.tsx          # React application entry point
└── index.css         # Global styles and Tailwind directives
```

## 🤝 Collaborators

  * **Aswin P** - Lead Developer / Collaborator
  * **Amal S Kumar** - Lead Developer / Collaborator

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](https://www.google.com/search?q=LICENSE.txt) file for details.


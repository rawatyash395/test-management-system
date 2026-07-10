# Test Management System

A modern, responsive, and robust **Test Management System** built with React, TypeScript, Vite, and Tailwind CSS. This system allows administrators and moderators to create, edit, view, delete, and publish educational or assessment tests, complete with rich text questions, subject/topic mapping, pagination, search/filtering, and user authentication.

---

## 🚀 Tech Stack

- **Frontend Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using the new `@tailwindcss/vite` plugin)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **State Management & API Fetching:** [React Query (TanStack Query v5)](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Form Management & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Rich Text Editor:** [@aloushek/react-draft-wysiwyg-next](https://github.com/aloushek/react-draft-wysiwyg-next) (compatible with React 19) & [Draft.js](https://draftjs.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linter:** [Oxlint](https://oxc.rs/docs/guide/usage/linter/rules) (fast linter)

---

## ✨ Features

1. **Authentication:**
   - Secure login screen.
   - Context-based Auth management (`AuthContext`) storing tokens and session information.
2. **Dashboard & Test List:**
   - Interactive card showcasing all tests.
   - Live Search.
   - Built-in pagination support for high performance.
   - **View Test:** Interactive slide-out modal fetching and listing all attached questions dynamically.
   - **Delete Test:** Secure confirmation modal to prevent accidental data loss.
3. **Test Editor & Creator:**
   - Step-by-step wizard for creating and publishing test cases (Basic Details -> Questions -> Publish).
   - Rich Text Editor support for compiling comprehensive questions.
   - Interactive subject/topic mapping using reusable dropdown elements.
   - In-place editing flow that pulls existing details and pre-fills questions.
   - Visual skeleton loaders displaying while test details load.

---

## 📁 Project Structure

```text
test-management/
├── public/                  # Static assets (favicons, public SVGs)
├── src/
│   ├── assets/              # SVGs, stickers, logos, hero images
│   ├── components/          # Reusable UI elements (Layout, Header, Sidebar, Dropdowns, RichTextEditor)
│   ├── context/             # Global Contexts (AuthContext)
│   ├── features/            # Feature modules (Auth, Test Cases / Creation / Editor / List / View)
│   ├── hooks/               # Custom hooks & React Query hooks (apiHooks)
│   ├── services/            # API client configurations (axios client wrapper)
│   ├── types/               # TypeScript type definitions and interfaces
│   ├── utils/               # Helper utilities & formatter functions
│   ├── App.css              # Application-specific styles
│   ├── index.css            # Base Tailwind CSS styles
│   ├── main.tsx             # App mount & provider setup
│   └── vite-env.d.ts
├── .env.example             # Template for Environment variables
├── .gitignore
├── .oxlintrc.json           # Linter configuration rules
├── package.json             # Scripts & dependencies
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration & build setup
```

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and npm installed.

### 1. Clone the Repository

```bash
git clone https://github.com/rawatyash395/test-management-system.git
cd test-management
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env
```

And configure the backend API base URL:

```env
VITE_API_URL=https://admin-moderator-backend-staging.up.railway.app/api
```

### 4. Running the Development Server

Start the development server with HMR:

```bash
npm run dev
```

The application will be running locally at `http://localhost:5173`.

### 5. Build for Production

Compile and bundle the application for production:

```bash
npm run build
```

This will run TypeScript type checks (`tsc -b`) and generate optimal production bundles under the `dist/` directory.

### 6. Preview the Production Build

You can preview the built files locally with:

```bash
npm run preview
```

### 7. Code Quality & Linting

Run the ultra-fast Oxlint linter to scan for potential issues:

```bash
npm run lint
```

---

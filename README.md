# Trailbook

Trailbook is a community guide to hiking trails, mostly in the Bulgarian mountains (Rila, Pirin, Vitosha, the Rhodopes, Stara Planina and others). Anyone can browse and search the trails. After signing up, a hiker can add their own routes, edit or delete them, like trails from other people and leave comments. I built it as my React exam project with Vite, React 19 and react-router 7, and the data lives in Supabase.

**Live demo:** https://YOUR-DEPLOY-URL

The backend is Supabase (hosted Postgres and Auth), so there is nothing extra to deploy. The app talks to it with plain `fetch` calls to its REST endpoints.

## Features

* Public catalog of trails with search, difficulty filter and sorting, all kept in the URL
* Trail details with stats, author, likes and comments
* Register, login, logout, and the session survives a page refresh
* Add, edit and delete your own trails
* Like and unlike other people's trails (you cannot like your own)
* Add and delete your own comments
* "My trails" page with a tab for trails I added and a tab for trails I liked
* Public hiker profile pages
* Form validation with clear messages, loading spinners, error messages with a retry button, empty states and a 404 page

## Tech stack

| Part | What I used |
|:-|:-|
| UI | React 19, function components and hooks |
| Routing | react-router 7 (`BrowserRouter`, `Routes`, nested layout route, guards) |
| Build tool | Vite 8 |
| Backend | Supabase (Postgres, Auth, Row Level Security) used through `fetch` against the REST endpoints, no supabase-js |
| Styling | Plain CSS files next to each component |
| Icons | lucide-react |
| Linting | ESLint with the react-hooks and react-refresh plugins |

## Getting started

### Requirements

* Node.js 20.19+ or 22.12+
* npm
* A free Supabase project (https://supabase.com)

### Install

```bash
git clone <this repository url>
cd sofutnireact
npm install
```

Copy `.env.example` to `.env.local` and fill in the two values from your Supabase project (Project Settings, then API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Only the project URL and the publishable key go here. Never put a secret or service role key in a Vite env file, because everything with the `VITE_` prefix ends up in the browser bundle.

### Supabase setup

1. Open the SQL editor in your Supabase project and run `supabase/schema.sql`. It creates the tables, the constraints, the indexes and the trigger that creates a profile for every new user.
2. Run `supabase/policies.sql` after it. It sets the table privileges and the Row Level Security policies.
3. Optional: to get some sample trails, first register a user in the app. Then open `supabase/seed.sql`, replace the `your_username` placeholder with that username and run it in the SQL editor.
4. In Authentication, Providers, make sure the Email provider is enabled.
5. Decide about "Confirm email" (Authentication, Sign In / Providers, Email):
   * **On:** after registering, the user is sent to the login page with a message to check their inbox. They can only log in after clicking the link in the email.
   * **Off:** registration returns a session straight away, so the user is logged in and sent to the catalog. This is the easiest option while developing.
6. In Authentication, URL Configuration, set the Site URL to `http://localhost:5173` for local work and add the same address to the Redirect URLs. When the app is deployed, change the Site URL to the production address (see Deployment).

### Run it

```bash
npm run dev
```

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

## Deployment

I deploy it as a static site on Netlify or Vercel.

1. Push the repository to GitHub and import it on the host.
2. Build command: `npm run build`. Output folder: `dist`.
3. Add the two environment variables on the host: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. They are read at build time, so redeploy after changing them.
4. The single page app rewrite is already in the repo: `public/_redirects` for Netlify (`/*    /index.html   200`) and `vercel.json` for Vercel. Without it, refreshing on a route like `/trails/5` would give a 404 from the host.
5. In Supabase, Authentication, URL Configuration, set the Site URL to the production address and add it to the Redirect URLs. Confirmation emails use this address.
6. Replace `YOUR-DEPLOY-URL` at the top of this file with the real address.

A free Supabase project pauses after about a week without activity. Before the project is reviewed, open the Supabase dashboard and restore it if it is paused, otherwise every request from the app will fail.

## Project structure

```
src/
  api/          fetch wrapper (request.js) and one file per resource: auth, trails, comments, likes, profiles
  components/
    comments/   comment section, form and single comment
    guards/     PrivateRoute and GuestRoute
    layout/     Layout, Header, Footer
    trails/     trail card, grid, form, filters, like button, badges, images
    ui/         Spinner, ErrorMessage, EmptyState, TextField, toasts
  contexts/     AuthProvider and NotificationProvider (plus their context objects)
  hooks/        useAuth, useFetch, useDebounce, useDocumentTitle, useNotify
  pages/        one folder per route (Home, Catalog, TrailDetails, CreateTrail, ...)
  utils/        validators, constants, formatting, trail form helpers
supabase/       schema.sql, policies.sql, seed.sql
public/         favicon and the Netlify rewrite file
```

More detail on how the pieces fit together is in [ARCHITECTURE.md](ARCHITECTURE.md).

# Trailbook

Trailbook is a community guide to hiking trails, mostly in the Bulgarian mountains (Rila, Pirin, Vitosha, the Rhodopes, Stara Planina and others). Anyone can browse and search the trails. After signing up, a hiker can add their own routes, edit or delete them, like trails from other people and leave comments. I built it as my React exam project with Vite, React 19 and react-router 7, and the data lives in Supabase.

**Live demo:** https://softuni-react-exam-one.vercel.app

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
* A banner when the connection drops, and an error boundary so a crash never leaves a blank page

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
git clone https://github.com/TedoNeObichaJavaScript/Softuni-React-exam.git
cd Softuni-React-exam
npm install
```

Copy `.env.example` to `.env.local` and fill in the two values from your Supabase project (Project Settings, then API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Only the project URL and the publishable key go here. Never put a secret or service role key in a Vite env file, because everything with the `VITE_` prefix ends up in the browser bundle.

### Supabase setup

When you create the project, keep **Enable Data API** on. **Automatically expose new tables** can be turned off, because `policies.sql` grants exactly what each table needs.

1. Open the SQL editor in your Supabase project and run `supabase/schema.sql`. It creates the tables, the constraints, the indexes and the trigger that creates a profile for every new user.
2. Run `supabase/policies.sql` after it. It sets the table privileges and the Row Level Security policies.
3. Optional: to get 8 sample trails with real photos, first register a user in the app. Then open `supabase/seed.sql`, replace the `your_username` placeholder with that username and run it in the SQL editor. The photos are served by the app itself from `public/images/trails`.
4. In Authentication, Sign In / Providers, make sure the Email provider is enabled.
5. Decide about **Confirm email** (Authentication, Sign In / Providers, in the User Signups section). The live demo has it off:
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

A free Supabase project pauses after about a week without activity. Before the project is reviewed, open the Supabase dashboard and restore it if it is paused, otherwise every request from the app will fail.

## Project structure

```
src/
  api/          fetch wrapper (request.js) and one file per resource: auth, trails, comments, likes, profiles
  components/
    comments/   comment section, form and single comment
    guards/     PrivateRoute and GuestRoute
    layout/     Layout, Header, Footer, OfflineBanner
    trails/     trail card, grid, form, filters, like button, badges, images
    ui/         Spinner, ErrorMessage, EmptyState, TextField, ErrorBoundary, toasts
  contexts/     AuthProvider and NotificationProvider (plus their context objects)
  hooks/        useAuth, useFetch, useDebounce, useDocumentTitle, useNotify, useOnlineStatus
  pages/        one folder per route (Home, Catalog, TrailDetails, CreateTrail, ...)
  utils/        validators, constants, formatting, trail form helpers
supabase/       schema.sql, policies.sql, seed.sql
public/         favicon, trail photos (images/trails) and the Netlify rewrite file
```

More detail on how the pieces fit together is in [ARCHITECTURE.md](ARCHITECTURE.md).

## Photo credits

The photos of the sample trails come from Wikimedia Commons. I resized and compressed them for the web, otherwise they are unchanged.

| Photo | Author | License |
|:-|:-|:-|
| [Seven Rila Lakes](https://commons.wikimedia.org/wiki/File:Pogled_kum_ezerata_ot_biloto.JPG) | Senior maloney | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| [Musala](https://commons.wikimedia.org/wiki/File:Musala-celek.JPG) | František Rochovanský (Rochovaf) | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| [Cherni Vrah](https://commons.wikimedia.org/wiki/File:Cherni_Vrah_Vitosha_07.jpg) | Иван | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| [Vihren](https://commons.wikimedia.org/wiki/File:Vihren,_Pirin_National_Park_01.JPG) | Спасимир | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| [Boyana Waterfall](https://commons.wikimedia.org/wiki/File:Boyana_falls.jpg) | Mrejorix | Public domain |
| [Krushuna Falls](https://commons.wikimedia.org/wiki/File:Krushuna_waterfalls_061.jpg) | Vislupus | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| [Trigrad Gorge](https://commons.wikimedia.org/wiki/File:Trigrad_Gorge_1.jpg) | Borislav krustev | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| [Botev peak](https://commons.wikimedia.org/wiki/File:Below_Botev_peak.jpg) | Derbeth | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

# Functional Guide

## 1. Project Overview

**Application Name:** Trailbook

**Application Category / Topic:** Community guide for hiking trails (a catalog with user generated content, similar to a small social site)

**Main Purpose:** Trailbook lets hikers share and discover trails in the Bulgarian mountains. It solves the problem of useful route information being scattered across forums and chats. Every trail has its region, difficulty, distance, elevation gain, duration and a description. Logged in users publish their own trails, like other people's trails and discuss them in comments.

## 2. User Access & Permissions

### Guest (Not Authenticated)

* **Available pages / routes:** `/` (home), `/trails` (catalog), `/trails/:trailId` (details), `/users/:userId` (hiker profile), `/about`, `/login`, `/register`, and the 404 page. Guests cannot open `/trails/new`, `/trails/:trailId/edit` or `/my-trails`; they are redirected to `/login`.
* **Public data shown:** all trails with author name, like count and comment count, the full details of a trail, all comments, and public profiles with the trails of that hiker. The like button and the comment form are replaced by "Log in to like" and "Log in to join the conversation" links.

### Authenticated User

* **Main sections / pages:** everything a guest sees plus `/trails/new`, `/trails/:trailId/edit` and `/my-trails`. The header shows "My trails", an "Add a trail" button, the profile link and a logout button. `/login` and `/register` are no longer reachable (the user is redirected away).
* **Details pages:** the details page shows a like button for trails of other people, a comment form, delete buttons on the user's own comments and Edit and Delete buttons on the user's own trails.
* **Create / Edit / Delete actions:** create a trail, edit and delete only their own trails, like and unlike trails of other people, create comments and delete their own comments. These rules are checked in the UI and again in the database with Row Level Security, so calling the REST API by hand does not bypass them.

## 3. Authentication & Session Handling

### Authentication Flow

1. **App load:** `main.jsx` renders `BrowserRouter`, then `NotificationProvider`, then `AuthProvider`, then `App`. When `AuthProvider` mounts it reads the saved session from `localStorage` (key `trailbook.session`) in the `useState` initializer, so the first render already knows if someone is logged in.
2. **Status check:** components call `useAuth()`, which exposes `user` and `isAuthenticated` (`Boolean(user)`). The route guards and the header use that value.
3. **Registration:** the form validates the fields, checks that the username is free, and calls `POST /auth/v1/signup` with the username in the user metadata. A database trigger creates the matching row in `profiles`. If Supabase returns a session (Confirm email off), it is stored and the user goes to `/trails` with a welcome toast. If it does not (Confirm email on), the user is sent to `/login` with a message to confirm the email.
4. **Login:** `POST /auth/v1/token?grant_type=password`. On success the session `{ accessToken, refreshToken, expiresAt, user }` is saved to state and `localStorage`, a toast says welcome back, and the user is sent to the page they originally wanted (`location.state.from`) or `/trails`.
5. **Logout:** the local session is cleared first (state and `localStorage`), so the UI updates immediately, then the app calls `POST /auth/v1/logout` with scope local. If that request fails, nothing changes for the user. The header sends the user to the home page in the same update, so logging out from a private page does not end up on the login form.

### Session Persistence

* **Storage:** the session lives in React state inside `AuthProvider` (shared through Context) and is mirrored to `localStorage` under `trailbook.session`. Reads and writes are wrapped in `try/catch` in case storage is blocked.
* **Auto login after refresh:** on load the stored session becomes the initial state. If its access token expires in less than 60 seconds, an effect calls `POST /auth/v1/token?grant_type=refresh_token` and replaces the session. Before every write request, pages call `getAccessToken()`, which returns the current token or refreshes it first when it is about to expire. Concurrent calls share one refresh request. If Supabase rejects the refresh token, the session is cleared and the user sees "Your session has expired. Please log in again." If the refresh only fails because the network or the server is down, the session is kept and the normal error message is shown, so a short outage does not log anyone out. A refresh that finishes after the user has logged out is ignored. A `storage` event listener keeps other tabs in sync, so logging out in one tab logs out the others.

## 4. Routing Structure

### Route Guards Logic

Two small components render `<Outlet />` or redirect:

* `PrivateRoute`: if the user is not authenticated it redirects to `/login` with `state={{ from: location }}`, so login can send the user back.
* `GuestRoute`: if the user is authenticated it redirects to the saved `from` location or `/trails`, so a logged in user never sees the login and register forms.

In `App.jsx` they wrap groups of routes, so there is no per page auth check. The edit page has one extra check: it shows a message if the logged in user is not the author of the trail.

### Main Routes

There are 11 top-level page routes: 5 public, 3 private, 2 guest only and 1 catch all.

| Route | Page | Access |
|:-|:-|:-|
| `/` | Home (latest trails) | public |
| `/trails` | Catalog | public |
| `/trails/:trailId` | Trail details | public, actions need login |
| `/users/:userId` | Hiker profile | public |
| `/about` | About | public |
| `/trails/new` | Add trail | private |
| `/trails/:trailId/edit` | Edit trail (author only) | private |
| `/my-trails` | My trails (`?tab=added` or `?tab=liked`) | private |
| `/login` | Login | guest only |
| `/register` | Register | guest only |
| `*` | Not found | public |

### Nested & Parameterized Routes

* **Nested routes:** one layout route (`<Route element={<Layout />}>`) wraps all pages. `Layout` renders the header, an `<Outlet />` inside `<main>` and the footer, and scrolls to the top on navigation. Inside it, the `PrivateRoute` and `GuestRoute` pathless routes are nested a second level.
* **URL parameters:** `/trails/:trailId`, `/trails/:trailId/edit` and `/users/:userId`, read with `useParams()`. Search params are used for `/trails` (`q`, `difficulty`, `sort`) and `/my-trails` (`tab`). Invalid ids (not a number or not a UUID) are rejected in the api layer and show the "not found" state without sending a request.

## 5. List to Details Flow

### Catalog / List Page

* **Data displayed:** `/trails` loads trails with their author, like list and comment list in one request. Each card shows the image (or a generated drawing when there is no image), the difficulty badge, title, region, stats, author, likes and comment count. The home page shows the 3 newest trails the same way.
* **Interaction:** a search box (matches title or region, debounced by 400 ms), a difficulty filter and a sort select (newest, oldest, shortest, longest, name). All three live in the URL search params (`?q=rila&difficulty=hard&sort=longest`), so the page can be shared and the back button works. Unknown values in the URL fall back to defaults. A "Reset filters" button clears them. The filtering and sorting are done by Supabase (`ilike`, `eq`, `order`), not in the browser.

### Details Page

* **Navigation:** each card is a `Link` to `/trails/${id}`. The details page also links back to the catalog, to the author's profile and to the edit page. After creating or editing a trail the app uses `useNavigate`.
* **Route params:** `useParams()` gives `trailId`, which is passed to `getTrail(trailId, signal)`. The same id is passed to the comment section, and the comparison `user.id === trail.owner_id` decides whether Edit and Delete show up.

## 6. Data Source & Backend

### Backend Type

A real backend: Supabase as a Backend as a Service (Postgres database, Auth and auto generated REST API). I do not use supabase-js. Every call goes through one `request()` function in `src/api/request.js` that uses `fetch`, adds the `apikey` and `Authorization: Bearer` headers, parses JSON and turns failures into an `ApiError`.

| Table | Columns | Notes |
|:-|:-|:-|
| `profiles` | id (= auth user id), username, created_at | created by a trigger on signup, username unique ignoring case |
| `trails` | id, title, region, difficulty, distance_km, elevation_gain_m, duration_hours, description, image_url, owner_id, created_at | owner_id references profiles |
| `comments` | id, trail_id, body, owner_id, created_at | deleted together with their trail |
| `likes` | trail_id, owner_id, created_at | composite primary key, so one like per user per trail |

Auth uses the Supabase endpoints under `/auth/v1/` (signup, token, logout). Data uses `/rest/v1/<table>`.

## 7. Data Operations (CRUD)

All four operations are implemented for the `trails` collection.

### Create (POST)

A logged in user opens `/trails/new` and fills in `TrailForm`. On submit the values are validated, converted by `toTrailPayload` (snake case, real numbers, `null` for an empty image) and sent with `POST /rest/v1/trails`. The owner is set by the database from the token (`default auth.uid()`). After success a toast appears and the app navigates to the new trail's details page.

### Read (GET)

* The catalog, the home page, My trails and profile pages call the list functions in `src/api/trails.js` and `likes.js` through the `useFetch` hook.
* The details page calls `getTrail`, which fetches by id and throws a 404 `ApiError` when nothing is returned.
* Comments are loaded by the comment section with `getComments`, oldest first.

### Update (PUT/PATCH)

The author clicks Edit on the details page, which opens `/trails/:trailId/edit`. The page loads the trail, checks that the current user owns it, and fills `TrailForm` with `toTrailFormValues`. Saving sends `PATCH /rest/v1/trails?id=eq.<id>`. If no row comes back (someone who is not the owner), the api layer throws "Only its author can edit it." After a successful save the user gets a toast and returns to the details page, which fetches the fresh data on mount.

### Delete

The author clicks Delete on the details page and confirms in an inline "Yes, delete / Cancel" box. The app sends `DELETE /rest/v1/trails?id=eq.<id>`, shows a toast and navigates to `/my-trails`, where the list is fetched again, so the trail is gone. Its comments and likes are removed by cascading foreign keys. On failure the buttons come back and an error toast shows the message.

### Interactions

* **Likes:** `LikeButton` updates the count immediately (optimistic update), then sends `POST /rest/v1/likes` or `DELETE` for the pair of trail and user. If the request fails, the previous likes are restored and an error toast appears. Guests see a link to log in, authors see a static count.
* **Comments:** a new comment is sent with `POST /rest/v1/comments` and appended to the list from the server response. Deleting asks `window.confirm`, removes the comment from the list right away and puts it back if the request fails.

## 8. Forms & Validation

### Forms Used

1. Login (email, password)
2. Register (username, email, password, repeat password)
3. Trail form, used for both Add trail and Edit trail (title, region, difficulty, distance, elevation gain, duration, description, image URL)
4. Comment form (one textarea)
5. Catalog filters (search input and two selects, these are not submitted, they drive the URL)

All inputs are controlled (`value` and `onChange`). Forms use `noValidate` and custom validators from `src/utils/validators.js`. Errors show after a field is blurred or after the first submit attempt, and on submit the first invalid field gets focus.

### Validation Rules

| Field | Rules |
|:-|:-|
| Username (register) | required; 3 to 20 characters; only letters, numbers and underscores; must not be taken (checked against `profiles`, ignoring case) |
| Email (login, register) | required; must match a simple `name@domain.tld` pattern |
| Password (register) | required; at least 8 characters; at most 72; at least one letter and one number |
| Repeat password | required; must be equal to the password |
| Password (login) | required |
| Title | required; 3 to 80 characters |
| Region | required; 2 to 60 characters |
| Difficulty | must be easy, moderate or hard |
| Distance | required; a number from 0.1 to 300 km |
| Elevation gain | required; a whole number from 0 to 5000 m |
| Duration | required; a number from 0.1 to 72 hours |
| Description | required; 20 to 2000 characters |
| Image URL | optional; if present it must be a valid http:// or https:// link or a photo path from the site (`/images/...` ending in .jpg, .png or .webp), at most 500 characters |
| Comment | required after trimming; at most 500 characters |

The field with the most rules is the password: required, minimum 8, maximum 72, and a letter plus a number. The same limits exist as `check` constraints in `supabase/schema.sql`, so the database enforces them even if the form is bypassed.

## 9. React-Specific Techniques

### Hooks & Component Lifecycle

* **useState:** form values, touched fields, submit state, header menu, optimistic likes, toasts, the session.
* **useEffect:** `useFetch` (data loading), `useDebounce` (timer), `useDocumentTitle`, `Toast` (auto dismiss timer), `AuthProvider` (refresh on load and `storage` listener).
* **useCallback:** memoized fetchers in pages (needed because `useFetch` reruns when the fetcher changes) and the functions exposed by the providers.
* **useMemo:** the Context value in `AuthProvider`.
* **useRef:** the current session and the pending refresh promise in `AuthProvider`, and the id counter for toasts.
* **useParams, useSearchParams, useNavigate, useLocation:** from react-router, in pages and guards.
* **useSyncExternalStore:** `useOnlineStatus` reads `navigator.onLine` and subscribes to the browser's `online` and `offline` events.
* **Custom hooks:** `useAuth`, `useFetch`, `useDebounce`, `useDocumentTitle`, `useNotify`, `useOnlineStatus`.
* **Class lifecycle methods:** `ErrorBoundary` is the one class component, because catching render errors still needs `getDerivedStateFromError` and `componentDidCatch`.

**Mount / update / unmount example (`useFetch`):** when a page mounts, the effect creates an `AbortController` and calls the fetcher with its signal. When the fetcher changes (for example the user picks another difficulty in the catalog, or `trailId` changes), the effect cleanup aborts the previous request and a new one starts, so an old slow response can never overwrite a newer one. When the page unmounts, the cleanup aborts the request in flight and no state is set afterwards. The `Toast` component works the same way: it starts a 4.5 second timer when it mounts and clears it on unmount, and the `AuthProvider` adds a `storage` listener on mount and removes it on unmount. `useOnlineStatus` does the same with the `online` and `offline` events, which is what shows and hides the offline banner.

### Context API

* **AuthContext:** `user`, `isAuthenticated`, `login`, `register`, `logout`, `getAccessToken`. Consumed (through `useAuth`) by the header, both route guards, Login, Register, Catalog, TrailDetails, EditTrail, CreateTrail, MyTrails, UserProfile, LikeButton and the comment components.
* **NotificationContext:** the `notify(message, type)` function. Consumed (through `useNotify`) by the pages and components that give feedback after an action. The provider owns the toast list and renders the toasts.

### Component Styling

Plain CSS, no library. `src/index.css` has the global styles (reset, fonts, page layout, buttons, form fields) and every component or page that needs its own styles has a CSS file next to it, imported at the top (for example `TrailCard.jsx` and `TrailCard.css`). Class names are kebab case and start with the component name. The layout is mobile first and works from 360 px wide.

## 10. Typical User Flow

1. A visitor opens the home page, sees the latest trails and clicks "Browse trails".
2. In the catalog they type "rila" in the search box and choose "Hard". The URL updates and the list reloads.
3. They click a card and read the details and comments on the trail page.
4. They click "Log in to like", go to the login form, register a new account, and are sent to the catalog (or to the login page first if email confirmation is on).
5. After logging in they open the trail again, like it and write a comment.
6. They click "Add a trail", fill in the form and publish. They land on the new trail's page.
7. From "My trails" they open the trail, click Edit, fix the duration and save.
8. Later they delete a trail they no longer want, confirm in the inline box and end up on "My trails".
9. They log out from the header and the private links disappear.

## 11. Error & Edge Case Handling

### Authentication errors

* Server errors are mapped to plain messages: wrong email or password, email not confirmed, email already registered, too many attempts, weak password. They show in an alert above the form.
* A taken username is caught before sign up and shown under the username field.
* If a token cannot be refreshed, the session is cleared and the user gets "Your session has expired. Please log in again."
* Visiting a private page as a guest redirects to login and returns the user afterwards. Visiting login while logged in redirects away.

### Network or data errors

* `request()` turns a failed `fetch` into "Could not reach the server. Check your connection and try again." and unknown server errors into readable fallback messages by status.
* Pages show a `Spinner` while loading and an `ErrorMessage` with a retry button when loading fails. Aborted requests are ignored.
* Failed actions (like, comment, delete, save) show an error toast or message. Optimistic changes for likes and comment deletes are rolled back.
* If the Supabase settings are missing from `.env.local`, the app says so instead of failing silently.
* When the connection drops, a banner under the header says so and explains that changes will not be saved. It goes away by itself when the connection is back.
* An error boundary wraps the page content. If something unexpected breaks while rendering, the user sees a message with Reload and Go home buttons instead of a blank page, and the header keeps working. Moving to another page resets it.
* Database constraint errors (invalid trail data, duplicate like, liking your own trail, deleting someone else's row) are translated into specific messages.

### Empty or missing data

* The catalog shows "No trails yet" when the table is empty and "No trails match your filters" with a reset button when a search finds nothing.
* My trails has an empty state for each tab, the comment section says "No comments yet", and the details page for a missing trail has its own state.
* A trail or profile that does not exist (or an invalid id in the URL) shows a "not found" state, and unknown URLs show the 404 page.
* Trails without an image get a generated drawing, and a missing author name falls back to "a hiker".

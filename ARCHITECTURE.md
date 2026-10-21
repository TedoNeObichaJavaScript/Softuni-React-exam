# Architecture

Short notes on how Trailbook is put together.

## Overview

```
Browser (Vite + React 19 single page app)
  main.jsx
    BrowserRouter
      NotificationProvider   toasts, notify()
        AuthProvider         session, login, logout, getAccessToken()
          App                Routes
            Layout (Header, Outlet, Footer)
              pages -> components -> hooks (useFetch, useAuth, ...)
                                        |
                                  src/api/*.js
                                        |
                                  src/api/request.js (fetch)
                                        |
Supabase:  /auth/v1/*  (Auth)     /rest/v1/*  (PostgREST on Postgres, RLS)
```

## Folders

| Folder | Responsibility |
|:-|:-|
| `src/api` | The only place that knows about URLs and headers. `request.js` is the fetch wrapper, the other files map one resource each to REST calls and return plain objects. |
| `src/contexts` | `AuthProvider` and `NotificationProvider`, with the context objects in separate `.js` files so component files only export components. |
| `src/hooks` | `useAuth` and `useNotify` (context readers), `useFetch`, `useDebounce`, `useDocumentTitle`. |
| `src/components` | Shared pieces grouped by feature: layout, guards, trails, comments, ui. |
| `src/pages` | One folder per route. Pages own the data loading and decide what to render (loading, error, empty, data). |
| `src/utils` | Validators, constants, formatters and helpers that convert between form values and database payloads. |
| `supabase` | SQL for the schema, the policies and optional sample data. |

## Data flow

1. A page defines a memoized fetcher, for example `useCallback((signal) => getTrail(trailId, signal), [trailId])`.
2. `useFetch(fetcher)` runs it in an effect with an `AbortController` and returns `{ data, error, isLoading, reload, setData }`. Loading is derived (the stored result does not belong to the current fetcher yet) instead of being set inside the effect.
3. The function in `src/api/trails.js` builds query params (`select`, `order`, filters) and calls `request(path, options)`.
4. `request()` builds the URL from `VITE_SUPABASE_URL`, adds `apikey` and the bearer token, calls `fetch`, parses the body and throws an `ApiError` (message, status, code) on failure. Abort errors are rethrown untouched.
5. The page renders the right state. Writes go the other way: the page calls `getAccessToken()`, passes the token to the api function and then updates the UI (navigate, `setData`, or a local optimistic update).

## Auth and session design

* The session `{ accessToken, refreshToken, expiresAt, user }` is kept in `AuthProvider` state and mirrored to `localStorage` under the key `trailbook.session`.
* The initial state is read from storage synchronously, so a refresh keeps the user logged in without a flash of the guest UI.
* `getAccessToken()` returns the token, or refreshes it when it expires in under 60 seconds. The pending refresh promise is stored in a ref, so many calls at the same time trigger one refresh request. If Supabase rejects the refresh token the session is cleared and a 401 `ApiError` is thrown. Network errors keep the session, and a refresh that resolves after logout is dropped.
* A `storage` event listener re-reads the session when another tab logs in, logs out or refreshes, so tabs stay in sync.
* The username is sent as signup metadata. A database trigger copies it into `profiles`.

## Routing and guards

`App.jsx` has one layout route. Inside it, pathless `PrivateRoute` and `GuestRoute` elements group the routes that need them, and both render `<Outlet />` when access is allowed. `PrivateRoute` redirects guests to `/login` with the current location in router state. `GuestRoute` sends logged in users to that location or `/trails`. The catalog filters and the tab in My trails are URL search params. The host rewrites every path to `index.html` (`public/_redirects`, `vercel.json`).

## Database and security

Tables: `profiles` (id = auth user id), `trails`, `comments`, `likes` (composite key on trail and owner).

* `owner_id` columns default to `auth.uid()` and reference `profiles` through named foreign keys (`trails_owner_id_fkey`, `comments_owner_id_fkey`, `likes_owner_id_fkey`). Comments and likes also reference `trails` with cascade delete.
* Check constraints repeat the form rules (lengths, ranges, difficulty values, image URL format).
* Row Level Security is on for every table. Everyone can read. Only authenticated users can insert, and only rows where `owner_id = auth.uid()`. Update and delete on trails, and delete on comments and likes, are limited to the owner. Profiles are read only for clients. The like policy also rejects a like on your own trail.
* Why the foreign key hints are needed: `likes` links `trails` and `profiles` a second time (a trail has an owner, and likes connect trails to users). When a query embeds `profiles`, PostgREST cannot tell which relationship I mean, so the select uses `author:profiles!trails_owner_id_fkey(id,username)` to pick the owner relation. Comments use `profiles!comments_owner_id_fkey` for the same reason.

## Error handling strategy

* `ApiError` carries a readable message, the HTTP status and the Postgres or auth error code.
* The api files translate known codes into friendly text (wrong password, unique violation, policy violation, check violation). `request.js` has fallback messages by status and one message for network failures.
* Pages show `Spinner`, `ErrorMessage` with a retry button, or `EmptyState`. Actions that fail show an error toast. Optimistic updates (likes, comment delete) are rolled back.
* Invalid ids in the URL are rejected before any request is sent.

## Styling conventions

* Plain CSS. Global rules and shared classes (`.container`, `.page`, `.btn` variants, `.input`, `.field-error`) are in `src/index.css`.
* Every component or page with its own styles has a CSS file next to it, imported at the top, with kebab case class names prefixed by the component (`.trail-card-title`). State classes look like `.is-active`.
* Palette: green `#1e5a43` as the main color, amber `#f2a541` for the main call to action, a warm off white background `#f6f5f0`, dark text `#1d2421`, danger red `#b83a2c`. Difficulty badges use green, amber and red tints.
* Fonts are Bricolage Grotesque for headings and Inter for body text. Layout is mobile first with a 1120 px content width, and motion respects `prefers-reduced-motion`.

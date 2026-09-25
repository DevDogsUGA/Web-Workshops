# web-workshops

Starter code and finished demos for DevDogs at UGA's web workshops, built with
[Next.js](https://nextjs.org/).

## Branches

- **`main`** is a clean, empty Next.js app. Start here if you're following
  along live.
- Each workshop has its own branch, numbered in order (for example
  `01-nextjs-intro`). A workshop's branch contains the finished code
  from that session, plus one extra feature we didn't get to live.

To grab a finished workshop:

```sh
git fetch
git switch 01-nextjs-intro
```

## Running it

```sh
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## 02 · Supabase

Branch `02-supabase` adds a real backend to the guestbook: sign-in,
row-level security, and a Postgres table instead of in-memory state.

1. Create a project at [supabase.com](https://supabase.com), or run
   `npx supabase start` to spin one up locally.
2. Apply the two migrations under `supabase/migrations/` in order — either
   paste each file into the dashboard's SQL editor, or let
   `supabase start` / `supabase db reset` apply them for you.
3. Add "Sign in with DevDogs" as an OAuth provider:

   ```sh
   pnpm dlx @devdogsuga/devtools oauth
   ```

   Note: this provider is stored outside the migrations, so it needs to be
   re-added any time you run `supabase db reset`.
4. Copy `.env.example` to `.env.local` and fill in your project's URL and
   publishable key (both on the dashboard, under Project Settings > API).
5. `pnpm dev` as usual.

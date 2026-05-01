# GameVault

A game shop application built with React and Supabase.

## Tech Stack

- React + Vite
- Material UI (MUI)
- React Router
- Supabase (Auth)

## Features

- [x] MUI theme (dark mode, custom colors)
- [x] Navbar with search, cart and profile icons
- [x] Homepage with game cards
- [x] Game detail page
- [x] Authentication (login, register)
- [x] Protected user page
- [x] Favorites functionality
- [x] Protected cart route
- [x] Add to cart functionality
- [x] Real-time cart badge

## Database Setup

Run the following SQL in Supabase SQL Editor:

### Tables

```sql
CREATE TABLE games (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT,
  genre TEXT,
  description TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  game_id BIGINT REFERENCES games(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  game_id BIGINT REFERENCES games(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Getting Started

1. Clone the repo
2. Install dependencies

```bash
   npm install
```

3. Create `.env` file

```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
```

4. Start the app

```bash
   npm run dev
```

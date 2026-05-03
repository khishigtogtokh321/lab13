DO $$
BEGIN
  CREATE TYPE "BookStatus" AS ENUM ('active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "MemberStatus" AS ENUM ('active', 'inactive');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "LoanStatus" AS ENUM ('active', 'returned', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "AdminRole" AS ENUM ('admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "AdminStatus" AS ENUM ('active', 'disabled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role "AdminRole" NOT NULL DEFAULT 'admin',
  status "AdminStatus" NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(160) NOT NULL,
  isbn VARCHAR(32) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  status "BookStatus" NOT NULL DEFAULT 'active',
  total_copies INTEGER NOT NULL CHECK (total_copies > 0),
  available_copies INTEGER NOT NULL CHECK (available_copies >= 0 AND available_copies <= total_copies),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  status "MemberStatus" NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loans (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
  borrowed_at TIMESTAMPTZ NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  returned_at TIMESTAMPTZ,
  status "LoanStatus" NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users (status);
CREATE INDEX IF NOT EXISTS idx_books_search ON books (title, author, isbn);
CREATE INDEX IF NOT EXISTS idx_books_status_category ON books (status, category);
CREATE INDEX IF NOT EXISTS idx_members_status ON members (status);
CREATE INDEX IF NOT EXISTS idx_loans_status_due ON loans (status, due_at);
CREATE INDEX IF NOT EXISTS idx_loans_book_status ON loans (book_id, status);
CREATE INDEX IF NOT EXISTS idx_loans_member_status ON loans (member_id, status);

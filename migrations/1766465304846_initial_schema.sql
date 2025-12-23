CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  password text NOT NULL,
  role text DEFAULT 'viewer' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE TABLE IF NOT EXISTS website_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  ip text NOT NULL,
  owner_contact text,
  number_of_visits integer DEFAULT 1 NOT NULL,
  page_visits text,
  website_duration integer,
  location text,
  time time NOT NULL,
  date date NOT NULL,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_website_visits_ip ON website_visits (ip);
CREATE INDEX IF NOT EXISTS idx_website_visits_contact ON website_visits (owner_contact);
CREATE INDEX IF NOT EXISTS idx_website_visits_date ON website_visits (date);
CREATE INDEX IF NOT EXISTS idx_website_visits_location ON website_visits (location);

CREATE TABLE IF NOT EXISTS store_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  owner_contact text NOT NULL,
  number_of_visits integer DEFAULT 1 NOT NULL,
  location text NOT NULL,
  time time NOT NULL,
  date date NOT NULL,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_store_visits_contact ON store_visits (owner_contact);
CREATE INDEX IF NOT EXISTS idx_store_visits_date ON store_visits (date);
CREATE INDEX IF NOT EXISTS idx_store_visits_location ON store_visits (location);

CREATE TABLE IF NOT EXISTS login_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  location text,
  time time NOT NULL,
  date date NOT NULL,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_signups_email ON login_signups (email);
CREATE INDEX IF NOT EXISTS idx_login_signups_date ON login_signups (date);
CREATE INDEX IF NOT EXISTS idx_login_signups_location ON login_signups (location);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  contact_identifier text NOT NULL UNIQUE,
  first_website_visit timestamp with time zone,
  first_store_visit timestamp with time zone,
  signup_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contacts_identifier ON contacts (contact_identifier);
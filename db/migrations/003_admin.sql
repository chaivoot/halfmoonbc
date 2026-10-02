create table admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  -- for password reset emails, once an address is provided
  email text,
  password_hash text not null,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger admins_set_updated_at before update on admins
  for each row execute function set_updated_at();

create table admin_sessions (
  -- sha256 of the cookie token; the token itself is never stored
  token_hash text primary key,
  admin_id uuid not null references admins (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index admin_sessions_admin_idx on admin_sessions (admin_id);

create table login_attempts (
  id bigint generated always as identity primary key,
  username text not null,
  ip text,
  success boolean not null,
  attempted_at timestamptz not null default now()
);

create index login_attempts_recent_idx on login_attempts (attempted_at);

-- The initial password was shared in chat, so it must be changed on first login.
insert into admins (username, password_hash, must_change_password)
values ('admin', 'scrypt$32768$8$1$sCWFlrbyI2Xwh6gTPAgrBw$7aQtPQZsna3frRSeWCizMnCvRi6W-B8LtUkFTFycrRAXHgB7xxBY92rg_OZZbAVYQVBaUESy8DQmtUmFnUiVHQ', true);

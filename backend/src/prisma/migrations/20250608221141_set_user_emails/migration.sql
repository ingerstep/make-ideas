-- This is an empty migration.
update
  "User"
set
  email = concat(nick, '@gmail.com')
where
  email is null;
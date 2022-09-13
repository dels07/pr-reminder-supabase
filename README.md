# Bitbucket PR Reminder Bot - Supabase Edition

This repo contain code for bitbucket PR reminder bot implemented using Flock
incoming webhook API rewritten using supabase.

## Requirements

- Docker
- PostgreSQL
- Supabase account
- Bitbucket account
- Flock account

## How to Setup for Local Development

- Create Supabase account [here](https://app.supabase.com/)
- Install Supabase CLI [here](https://supabase.com/docs/guides/cli)
- Create Bitbucket app password, using guide
  [here](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords)
- Create Flock incoming webhook, using guide
  [here](https://docs.flock.com/display/flockos/Create+An+Incoming+Webhook)
- Please note all password, secret and webhook id as you need that for
  configuration

```bash
# clone repo
$ git clone https://github.com/dels07/pr-reminder-supabase.git
$ cd pr-reminder-supabase

# copy .env, please modify according to your config
$ cp ./supabase/.env.example ./supabase/.env.local

# make sure you already have supabase account and supabase cli installed
$ supabase login
$ supabase start

# for development of pr-reminder
$ supabase functions serve pr-reminder --env-file ./supabase/.env.local
# for development of pr-reminder-summary
$ supabase functions serve pr-reminder-summary --env-file ./supabase/.env.local

# for connect to local db
$ psql 'postgresql://postgres:postgres@localhost:54322/postgres'

# for local supabase studio
$ open http://localhost:54323

# create migration for production
# after you add/modify table in local database
$ supabase db diff migration_name -f file_name

# running migration on production, before deployment
$ supabase db push -p remote_db_password

# for deployment
$ cp ./supabase/.env.example ./supabase/.env
$ supabase secrets set --env-file ./supabase/.env
$ supabase functions deploy pr-reminder
$ supabase functions deploy pr-reminder-summary
```

## Setup PR Reminder

You need to fill several configurations within `configs` table in database.

```
bitbucket_repository : you can get it from url, format is organization/repo (ex: mid-kelola-indonesia/talenta-core)
bitbucket_username   : self-explanatory
bitbucket_password   : self-explanatory
flock_channel        : from webhook, insert only channel id
flock_review_channel : from webhook, insert only channel id
pr_authors           : use comma separated values (ex: Author 1,Author 2,Author 3), name must be same with the one from bitbucket
active               : true/false, to enable/disable reminder for specific config
```

## Setup Scheduled Job

To schedule a cron job for pr reminder & pr reminder summary, you need to
activate two extension in **Supabase Studio --> Database --> Extensions**.

- PG_CRON
- HTTP

This is an example script for pr reminder

```sql
select
  cron.schedule(
    'pr-reminder', -- name of the cron job
    '* * * * *', -- every minute
    $$
    select status, content
    from
      http((
          'POST',
           'https://xxxxx.functions.supabase.co/pr-reminder', -- url to call edge function
           ARRAY[http_header('Authorization','Bearer foobarbazabcxyz123')], -- change with service_url key
           'application/json',
           '{ "name": "test"}'
        )::http_request)
    $$
  );
```

This is an example script for pr reminder summary

```sql
select
  cron.schedule(
    'pr-reminder-summary-morning', -- name of the cron job
    '0 2 * * *', -- every 9:00 clock (2:00 UTC)
    $$
    select status, content
    from
      http((
          'POST',
           'https://xxxxx.functions.supabase.co/pr-reminder-summary', -- url to call edge function
           ARRAY[http_header('Authorization','Bearer foobarbazabcxyz123')], -- change with service_url key
           'application/json',
           '{ "name": "test"}'
        )::http_request)
    $$
  );
```

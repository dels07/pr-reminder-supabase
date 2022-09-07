# Bitbucket PR Reminder Bot - Supabase Edition

This repo contain code for bitbucket PR reminder bot implemented using Flock incoming webhook API rewritten using supabase.

## Requirements

- Docker
- Supabase account
- Bitbucket account
- Flock account

## How to Setup for Local Development

- Create Supabase account
  [here](https://app.supabase.com/)
- Install Supabase CLI
  [here](https://supabase.com/docs/guides/cli)
- Create Bitbucket app password, using guide
  [here](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords)
- Create Flock incoming webhook, using guide
  [here](https://docs.flock.com/display/flockos/Create+An+Incoming+Webhook)
- Please note all password, secret and webhook id as you need that for configuration

```bash
# clone repo
$ git clone https://github.com/dels07/pr-reminder-supabase.git
$ cd pr-reminder-supabase

# copy .env, please modify according to your config
$ cp ./supabase/.env.example ./supabase/.env.local

# make sure you already have supabase account and supabase cli installed
$ supabase login
$ supabase init
$ supabase start

# for development of pr-reminder
$ supabase functions serve pr-reminder --env-file ./supabase/.env.local
# for development of pr-reminder-summary
$ supabase functions serve pr-reminder-summary --env-file ./supabase/.env.local

# for deployment
$ cp ./supabase/.env.example ./supabase/.env
$ supabase secrets set --env-file ./supabase/.env
$ supabase functions deploy pr-reminder
$ supabase functions deploy pr-reminder-summary
```

## Special Notes
Since I haven't found way to connect to supabase db locally (likely need to self-hosting supabase on local).

We need to get supabase url and anon key from [supabase dashboard](https://app.supabase.com) and change `supabase/functions/_shared/supabase.ts:25-26`
```
const url = Deno.env.get("SUPABASE_URL")!;
const key = Deno.env.get("SUPABASE_ANON_KEY")!;
```
Using value from we got before.

## TODO
- [ ] Add DB migrations
- [ ] Connect or run db from local

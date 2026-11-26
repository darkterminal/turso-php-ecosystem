# Turso PHP Ecosystem Discord Worker

Cloudflare Worker for Discord slash commands.

## Commands

- `/packages` — list ecosystem packages and channels
- `/docs package:<key>` — repo/docs link
- `/install package:<key>` — install command
- `/help-template` — support request template
- `/support` — where to get help

## Setup

1. Install dependencies:
   ```bash
   cd cloudflare-worker
   npm install
   ```
2. Set Worker secret (Discord application public key):
   ```bash
   npx wrangler secret put DISCORD_PUBLIC_KEY
   ```
3. Deploy:
   ```bash
   npx wrangler deploy
   ```
4. In Discord Developer Portal, set **Interactions Endpoint URL** to the deployed Worker URL.
5. Register global commands:
   ```bash
   export TURSO_DISCORD_TOKEN=...
   export TURSO_DISCORD_CLIENT_ID=...
   npm run register
   ```

## Notes

- Uses Discord interactions (HTTP endpoint), no gateway process required.
- Package data comes from `../data/packages.json`.
- Keep responses plain English and scoped to Turso PHP Ecosystem repos.

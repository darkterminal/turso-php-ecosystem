#!/usr/bin/env node
import fs from 'node:fs';

const webhook = process.env.DISCORD_WEBHOOK_URL;
if (!webhook) {
  console.error('Missing DISCORD_WEBHOOK_URL');
  process.exit(1);
}

const repos = [
  { repo: 'darkterminal/turso-php-installer', name: 'turso-php-installer', channelHint: '#turso-php-installer' },
  { repo: 'tursodatabase/turso-client-php', name: 'turso-client-php', channelHint: '#turso-client-php' },
  { repo: 'darkterminal/turso-client-http', name: 'turso-client-http', channelHint: '#turso-client-http' },
  { repo: 'darkterminal/turso-api-client-php', name: 'turso-api-client-php', channelHint: '#turso-api-client-php' },
  { repo: 'darkterminal/turso-platform-laravel', name: 'turso-platform-laravel', channelHint: '#turso-platform-laravel' },
  { repo: 'tursodatabase/turso-driver-laravel', name: 'turso-driver-laravel', channelHint: '#turso-driver-laravel' },
  { repo: 'tursodatabase/turso-doctrine-dbal', name: 'turso-doctrine-dbal', channelHint: '#turso-doctrine-dbal' },
  { repo: 'darkterminal/turso-http-laravel', name: 'turso-http-laravel', channelHint: '#turso-http-laravel' },
];

const statePath = new URL('./release-state.json', import.meta.url);
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

async function ghJson(url) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'turso-php-ecosystem-release-notifier',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

function truncate(s, max = 350) {
  if (!s) return 'No release notes provided.';
  const clean = String(s).replace(/\r\n/g, '\n').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + '…';
}

async function postDiscord(payload) {
  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Discord webhook failed: ${res.status} ${body}`);
  }
}

let changed = false;
const notified = [];

for (const item of repos) {
  const latest = await ghJson(`https://api.github.com/repos/${item.repo}/releases/latest`);
  const prev = state[item.repo] || { id: null, tag: null, url: null, published_at: null };
  if (!latest) {
    state[item.repo] = prev;
    continue;
  }

  const current = {
    id: latest.id ?? null,
    tag: latest.tag_name ?? null,
    url: latest.html_url ?? null,
    published_at: latest.published_at ?? null,
  };

  const isNew = current.id && current.id !== prev.id;
  state[item.repo] = current;
  if (!isNew) continue;

  changed = true;
  notified.push(`${item.repo}@${current.tag}`);
  const body = truncate(latest.body);
  const content = [
    `**${item.name}** released \`${current.tag}\``,
    `Repo: https://github.com/${item.repo}`,
    `Release: ${current.url}`,
    `Channel: ${item.channelHint}`,
    '',
    body,
  ].join('\n');

  await postDiscord({
    username: 'Turso PHP Ecosystem Releases',
    allowed_mentions: { parse: [] },
    content: content.slice(0, 1900),
  });
}

fs.writeFileSync(statePath, JSON.stringify(state, null, 2).sort ? JSON.stringify(Object.fromEntries(Object.keys(state).sort().map(k => [k, state[k]])), null, 2) + '\n' : JSON.stringify(state, null, 2) + '\n');
console.log(changed ? `Notified: ${notified.join(', ')}` : 'No new releases');

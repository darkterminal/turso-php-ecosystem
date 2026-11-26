#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const token = process.env.TURSO_DISCORD_TOKEN;
const appId = process.env.TURSO_DISCORD_CLIENT_ID;
if (!token || !appId) {
  console.error('Missing TURSO_DISCORD_TOKEN or TURSO_DISCORD_CLIENT_ID');
  process.exit(1);
}

const packagesPath = path.resolve(process.cwd(), '../data/packages.json');
const packages = JSON.parse(fs.readFileSync(packagesPath, 'utf8'));
const choices = packages.map(p => ({ name: p.name, value: p.key }));

const commands = [
  {
    name: 'packages',
    description: 'List Turso PHP Ecosystem packages and channels',
  },
  {
    name: 'docs',
    description: 'Get docs/repo link for a Turso PHP Ecosystem package',
    options: [{ type: 3, name: 'package', description: 'Package', required: true, choices }],
  },
  {
    name: 'install',
    description: 'Get install command for a Turso PHP Ecosystem package',
    options: [{ type: 3, name: 'package', description: 'Package', required: true, choices }],
  },
  {
    name: 'help-template',
    description: 'Get a template for asking technical help',
  },
  {
    name: 'support',
    description: 'How to get support in this server',
  },
];

const res = await fetch(`https://discord.com/api/v10/applications/${appId}/commands`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bot ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(commands),
});

const body = await res.text();
if (!res.ok) {
  console.error(res.status, body);
  process.exit(1);
}
console.log('Registered commands:', JSON.parse(body).map(c => c.name).join(', '));

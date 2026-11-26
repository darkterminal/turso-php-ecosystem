import nacl from 'tweetnacl';
import packages from '../../data/packages.json';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function hexToUint8Array(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function verifyDiscordRequest(request, env, rawBody) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  if (!signature || !timestamp) return false;
  const msg = new TextEncoder().encode(timestamp + rawBody);
  const sig = hexToUint8Array(signature);
  const key = hexToUint8Array(env.DISCORD_PUBLIC_KEY);
  return nacl.sign.detached.verify(msg, sig, key);
}

function findPackage(key) {
  return packages.find(p => p.key === key);
}

function packageChoices() {
  return packages.map(p => ({ name: p.name, value: p.key }));
}

function ephemeral(content) {
  return jsonResponse({ type: 4, data: { content, flags: 64, allowed_mentions: { parse: [] } } });
}

function publicMessage(content) {
  return jsonResponse({ type: 4, data: { content, allowed_mentions: { parse: [] } } });
}

function helpTemplate() {
  return [
    '**Help request template**',
    'Please include:',
    '- Package name and version',
    '- PHP version (`php -v`)',
    '- OS/runtime (Linux/macOS/Windows, Docker, Laravel/Symfony, etc.)',
    '- libSQL extension version if relevant (`php -r "echo LibSQL::version();"`) ',
    '- Minimal code or reproduction',
    '- Full error message / stack trace',
    '',
    'Use triple backticks for code. Do not share tokens or secrets.',
  ].join('\n');
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const rawBody = await request.text();
    const ok = await verifyDiscordRequest(request, env, rawBody);
    if (!ok) return new Response('Bad request signature', { status: 401 });

    const interaction = JSON.parse(rawBody);
    if (interaction.type === 1) return jsonResponse({ type: 1 });

    if (interaction.type !== 2) return jsonResponse({ error: 'Unsupported interaction type' }, 400);
    const name = interaction.data?.name;

    if (name === 'packages') {
      const lines = packages.map(p => `- **${p.name}** (\`${p.repo}\`) - ${p.channel}`);
      return publicMessage(['**Turso PHP Ecosystem packages**', ...lines, '', 'Hub: https://github.com/darkterminal/turso-php-ecosystem'].join('\n'));
    }

    if (name === 'help-template') return ephemeral(helpTemplate());

    if (name === 'support') {
      return ephemeral(['**Support**', '- Use the relevant package channel for technical questions.', '- For general help, post in #help with versions, OS, minimal code, and full error.', '- Keep messages in plain English.', '- Never share tokens or secrets.', '', 'Ecosystem hub: https://github.com/darkterminal/turso-php-ecosystem'].join('\n'));
    }

    if (name === 'docs' || name === 'install') {
      const key = interaction.data?.options?.find(o => o.name === 'package')?.value;
      const pkg = findPackage(key);
      if (!pkg) return ephemeral('Package not found.');
      if (name === 'docs') {
        return ephemeral(`**${pkg.name}**\n${pkg.description}\nRepo/Docs: ${pkg.docs}\nChannel: ${pkg.channel}`);
      }
      return ephemeral(`**${pkg.name} install**\n${pkg.install}\nDocs: ${pkg.docs}`);
    }

    return ephemeral('Unknown command.');
  },
};

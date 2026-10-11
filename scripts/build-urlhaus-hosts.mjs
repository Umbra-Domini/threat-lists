// Builds urlhaus-hosts.txt (one host per line) from the URLhaus "online" feed.
// Run by the GitHub Action. The Auth-Key stays in a repository secret and never reaches the website.
import { writeFileSync } from 'node:fs';

const FEED = 'https://urlhaus.abuse.ch/downloads/text_online/';
const KEY = process.env.ABUSECH_AUTH_KEY;

// Big shared platforms. URLhaus may list one bad file on them, but the whole host is not bad.
const SHARED = [
  'github.com', 'githubusercontent.com', 'google.com', 'googleusercontent.com', 'googleapis.com',
  'dropbox.com', 'dropboxusercontent.com', 'discord.com', 'discordapp.com', 'discordapp.net',
  'mediafire.com', 'mega.nz', 'onedrive.live.com', 'sharepoint.com', 'amazonaws.com', 'cloudfront.net',
  'azureedge.net', 'windows.net', 'telegram.org', 't.me', 'pastebin.com', 'bit.ly', 'tinyurl.com'
];

const res = await fetch(FEED, { headers: KEY ? { 'Auth-Key': KEY } : {} });
if (!res.ok) {
  console.error(`URLhaus feed answered with status ${res.status}. Keeping the old list.`);
  process.exit(1);
}

const hosts = new Set();
for (const raw of (await res.text()).split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  let h;
  try { h = new URL(line).hostname.toLowerCase().replace(/\.$/, ''); } catch { continue; }
  if (h.startsWith('[')) continue; // IPv6
  if (!/^([a-z0-9-]+(\.[a-z0-9-]+)+|\d{1,3}(\.\d{1,3}){3})$/.test(h)) continue;
  if (SHARED.some((d) => h === d || h.endsWith('.' + d))) continue;
  hosts.add(h);
}

// A broken answer must never replace a good list.
if (hosts.size < 20) {
  console.error(`Only ${hosts.size} hosts found. Keeping the old list.`);
  process.exit(1);
}

const out = ['# Hosts that URLhaus (abuse.ch) lists as serving malware. Rebuilt daily by GitHub Actions.',
  ...[...hosts].sort()].join('\n') + '\n';
writeFileSync('urlhaus-hosts.txt', out);
console.log(`Wrote ${hosts.size} hosts (${out.length} bytes).`);

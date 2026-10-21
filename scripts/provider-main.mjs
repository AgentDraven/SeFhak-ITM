/** Lock ITM to the validated main tips and published artifacts of shared providers. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => JSON.parse(readFileSync(resolve(root, relative), 'utf8').replace(/^\uFEFF/, ''));
const write = (relative, value) => writeFileSync(resolve(root, relative), JSON.stringify(value, null, 2) + '\n');
const git = (repo, ...args) => execFileSync('git', ['-C', repo, ...args], {encoding:'utf8'}).trim();
const syncing = process.argv.includes('--sync');
const checkRemote = process.argv.includes('--remote');
const checkHosted = process.argv.includes('--hosted');
const lockPath = 'cfg/providers.lock.json';

if (syncing) {
  const repos = {meritutils:'merit-utils', meritsubs:'merit-subs'};
  const providers = {};
  for (const [id, directory] of Object.entries(repos)) {
    const local = resolve(root, '..', directory);
    const repository = `AgentDraven/${directory}`;
    assert.equal(git(local, 'branch', '--show-current'), 'main', `${directory}: use canonical main`);
    assert.equal(git(local, 'remote', 'get-url', 'origin').replace(/\.git$/, ''), `https://github.com/${repository}`);
    git(local, 'fetch', 'origin', 'main');
    const commit = git(local, 'rev-parse', 'origin/main');
    assert.equal(git(local, 'rev-parse', 'HEAD'), commit, `${directory}: local main must match origin/main`);
    providers[id] = {repository, branch:'main', commit};
  }
  const utilsRoot = resolve(root, '..', 'merit-utils');
  const registry = JSON.parse(git(utilsRoot, 'show', `${providers.meritutils.commit}:pkg/registry.json`));
  const pins = {schema:'merit.par_pins.free.v1', line:'oss', packages:{}};
  for (const [key, packageId] of [['merit_workbench','merit_workbench'], ['journal','merit_journal'], ['merit_ux','merit_ux']]) {
    const versions = registry.packages[packageId];
    const version = Object.keys(versions).filter(v => /^\d+\.\d+\.\d+$/.test(v)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).at(-1);
    const entry = versions[version];
    const artifacts = {};
    for (const artifact of entry.artifacts) {
      const key = artifact.path === 'themes/gloss-aurora.css' ? 'theme' : artifact.path.endsWith('.global.js') ? 'global' : artifact.path.endsWith('.mjs') ? 'mjs' : artifact.path.endsWith('.js') ? 'js' : artifact.path.endsWith('.css') && !artifact.path.includes('/') ? 'css' : null;
      if (key) artifacts[key] = {url:artifact.url, sri:artifact.sri};
    }
    pins.packages[key] = {package_id:packageId, version, cdn_base:entry.cdn_base, artifacts};
  }
  const layout = JSON.parse(git(utilsRoot, 'show', `${providers.meritutils.commit}:cfg/provider-layout.json`));
  assert.equal(layout.services['merit-store'].root, 'services/merit-store');
  write(lockPath, {schema:'merit.consumer-provider-lock.v1', consumer:'ITM', providers, store:{provider:'meritutils', root:'services/merit-store', tenant:'itm', api_base:'https://merit-storev01.vercel.app/api'}});
  write('cfg/par_pins.json', pins);
  let play = readFileSync(resolve(root, 'play/index.html'), 'utf8');
  const wb = pins.packages.merit_workbench;
  const ux = pins.packages.merit_ux;
  const replacements = [
    [/href="[^"]*merit_workbench\/[^"/]+\/merit-workbench\.css" integrity="[^"]*"/, `href="${wb.artifacts.css.url}" integrity="${wb.artifacts.css.sri}"`],
    [/src="[^"]*merit_workbench\/[^"/]+\/merit-workbench\.js" integrity="[^"]*"/, `src="${wb.artifacts.js.url}" integrity="${wb.artifacts.js.sri}"`],
    [/href="[^"]*merit_ux\/[^"/]+\/themes\/gloss-aurora\.css" integrity="[^"]*"/, `href="${ux.artifacts.theme.url}" integrity="${ux.artifacts.theme.sri}"`],
    [/src="[^"]*merit_ux\/[^"/]+\/merit_ux\.global\.js" integrity="[^"]*"/, `src="${ux.artifacts.global.url}" integrity="${ux.artifacts.global.sri}"`],
  ];
  for (const [pattern, replacement] of replacements) {
    assert.ok(pattern.test(play), `Missing play pin: ${pattern}`);
    play = play.replace(pattern, replacement);
  }
  play = play.replace(/Checking hosted merit_workbench@[^ ]+ on [^…]+…/, `Checking hosted merit_workbench@${wb.version}…`);
  play = play.replace(/version: '\d+\.\d+\.\d+'/, `version: '${wb.version}'`);
  play = play.replace(/host: '[^']+'/, `host: '${new URL(wb.cdn_base).host}'`);
  writeFileSync(resolve(root,'play/index.html'), play);
}

const lock = read(lockPath);
assert.equal(lock.consumer, 'ITM');
assert.equal(lock.store.root, 'services/merit-store');
assert.equal(lock.store.provider, 'meritutils');
for (const provider of Object.values(lock.providers)) {
  assert.equal(provider.branch, 'main');
  assert.match(provider.commit, /^[0-9a-f]{40}$/);
  assert.match(provider.repository, /^AgentDraven\/merit-(utils|subs)$/);
  if (checkRemote) {
    const current = execFileSync('git', ['ls-remote', `https://github.com/${provider.repository}.git`, 'refs/heads/main'], {encoding:'utf8'}).split(/\s/)[0];
    assert.equal(provider.commit, current, `${provider.repository}: provider main advanced; run providers:sync and validate before release`);
  }
}
const pins = read('cfg/par_pins.json');
for (const entry of Object.values(pins.packages)) {
  for (const artifact of Object.values(entry.artifacts)) {
    const url = new URL(artifact.url);
    assert.equal(url.origin, 'https://merit-utilsv01.vercel.app');
    assert.match(artifact.sri, /^sha384-/);
    if (checkHosted) {
      const response = await fetch(url, {signal:AbortSignal.timeout(30000)});
      assert.ok(response.ok, `${url}: HTTP ${response.status}`);
      const actual = 'sha384-' + createHash('sha384').update(Buffer.from(await response.arrayBuffer())).digest('base64');
      assert.equal(actual, artifact.sri, `${url}: hosted integrity mismatch`);
    }
  }
}
console.log(`ITM shared-provider main lock and artifact contracts verified${checkRemote ? ' against remote main' : ''}${checkHosted ? ' with hosted integrity' : ''}`);

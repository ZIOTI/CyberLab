// Never run integration tests against an operator's server or databases.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawnSync } = require('node:child_process');

async function main() {
  const root = path.resolve(__dirname, '..');
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'cyberlab-tests-'));
  const listener = net.createServer();
  await new Promise((resolve, reject) => { listener.once('error', reject); listener.listen(0, '127.0.0.1', resolve); });
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  try {
    fs.cpSync(root, temporary, { recursive: true, filter: source => {
      const relative = path.relative(root, source);
      if (!relative) return true;
      return !relative.split(path.sep).some(part => ['.git', 'node_modules', 'dist', '.certificate-key'].includes(part)) &&
        !/\.(db(?:-.*)?|bak)$/i.test(relative) &&
        !(relative.endsWith('.exe') && !relative.startsWith('challenges' + path.sep));
    } });
    const suites = process.argv.slice(2);
    for (const suite of suites.length ? suites : ['test_suite.js']) {
      if (!/^test[\w-]*\.js$/.test(suite)) throw new Error('Invalid test suite');
      const result = spawnSync(process.execPath, [suite], {
        cwd: temporary, stdio: 'inherit',
        env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', CYBERLAB_TEST_ISOLATED: '1' }
      });
      if (result.error) throw result.error;
      if (result.status !== 0) { process.exitCode = result.status || 1; break; }
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

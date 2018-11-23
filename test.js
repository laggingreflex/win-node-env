const assert = require('assert');
const exec = cmd => require('child_process').execSync(cmd, { encoding: 'utf8' });
const parse = require('./command-parser');

const multiple = ex => e => it(e, () => {
  const [, bin, args] = e.match(/([\w_]+)(=.*)/);
  const output = JSON.parse(exec(`${ex}${bin} ${args} node -e "process.stdout.write(JSON.stringify(process.env))"`));
  const env = e.split(' ').reduce((env, e) => ({ ...env, [e.split('=')[0]]: e.split('=')[1] }), {});
  for (const [key, val] of Object.entries(env))
    assert.deepEqual([key, val], [key, output[key]]);
});

describe('command-parser', () => {
  const e = (test, expected) => it(test, () => assert.deepEqual(parse(test.split(/ /g)), expected))
  e('ENV=VAL command', { env: { ENV: 'VAL' }, cmd: ['command'] });
});

describe('bin', () => {
  const e = e => it(e, () => assert.equal('ok', exec(`node bin/${e} =ok node -e "process.stdout.write(process.env.${e})"`)));
  e('NODE_ENV');
  e('ENV');
  e('DEBUG');
  e('PORT');
  e('CHAI_JEST_SNAPSHOT_UPDATE_ALL');
  describe('multiple', () => {
    const e = multiple('node bin/');
    e('NODE_ENV=1 ENV=2');
    e('ENV=1 NODE_ENV=2');
    e('PORT=1 ENV=2');
    e('DEBUG=1 ENV=2');
    e('DEBUG=1 CHAI_JEST_SNAPSHOT_UPDATE_ALL=2');
  });
});

describe('CLI', () => {
  /* This module must be npm-link'ed (abd globally accessible) for this test to work */
  const e = e => it(e, () => assert.equal('ok', exec(`${e}=ok node -e "process.stdout.write(process.env.${e})"`)));
  e('NODE_ENV');
  e('ENV');
  e('DEBUG');
  e('PORT');
  e('CHAI_JEST_SNAPSHOT_UPDATE_ALL');
  describe('multiple', () => {
    const e = multiple('');
    e('NODE_ENV=1 ENV=2');
    e('ENV=1 NODE_ENV=2');
    e('PORT=1 ENV=2');
    e('DEBUG=1 ENV=2');
    e('CHAI_JEST_SNAPSHOT_UPDATE_ALL=1 ENV=2');
    it(';', () => assert.equal('okok', exec(`ENV=1 echo ok; node -e "process.stdout.write('ok')"`).replace(/[\n\r]+/g, '')))
  });
});

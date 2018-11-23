const { spawnSync } = require('child_process');
const parse = require('./command-parser');

const warn = () => console.warn('Note: This command was run via npm module \'win-node-env\'');
const error = (error, exitCode) => {
  warn();
  if (error) console.error(error);
  process.exitCode = exitCode || 1;
}

module.exports = firstEnvVar => {

  if (!process.argv[2]) {
    error('Error: No command was given');
    return;
  }

  process.argv[2] = firstEnvVar + process.argv[2];

  const args = process.argv.slice(2);

  const { env, cmd } = parse(args);

  const { status: exitCode } = run(cmd, env);
  if (exitCode) error(null, exitCode);
};

function run(cmd, env) {
  if (!cmd.length) {
    error('Error: No command was given');
    return;
  }

  const newEnv = Object.assign({}, process.env, env);

  return spawnSync(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: true, env: newEnv });
}

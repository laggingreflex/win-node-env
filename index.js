const Path = require('path');
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
  const combinedString = args.join(' ');
  const separateCommands = combinedString.split(/;/g).map(s => s.trim());
  const separateParsedCommands = separateCommands.map(s => parse(s.split(/ /g)));

  separateParsedCommands.forEach(({ env, cmd }, i) => {
    const result = run(cmd, env);
    const exitCode = result && result.status;
    if (exitCode && i === separateParsedCommands.length - 1) {
      error(null, exitCode);
    }
  });
};

function run(cmd, env) {
  if (!cmd.length) {
    error('Error: No command was given');
    return;
  }

  let newEnv = Object.assign({}, process.env, env);
  setNodeModulesBinPath(newEnv);

  return spawnSync(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: true, env: newEnv });
}

function setNodeModulesBinPath(env = process.env) {
  for (const PATH in env) {
    if (PATH.toLowerCase() === 'path') {
      const path = env[PATH];
      const split = path.split(';');
      split.push(Path.join('node_modules', '.bin'));
      env[PATH] = split.join(';');
      break;
    }
  }
}

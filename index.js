const { spawnSync } = require('child_process');

const warn = () => console.warn('Note: This command was run via npm module \'win-node-env\'');
const exit = (...error) => {
  if (error) {
    warn();
    console.error('Error:', ...error);
    process.exitCode = 1;
  }
}

module.exports = firstEnvVar => {

  if (!process.argv[2]) {
    exit('No command was given');
    return;
  }

  process.argv[2] = firstEnvVar + process.argv[2];
  const args = process.argv.slice(2)
  // .reduce((args, arg) => args.concat(arg.split(/[ ]+/g)), [])

  const env = {};
  const cmd = [];

  let envDone;
  for (const arg of args) {
    if (envDone) {
      cmd.push(arg);
    } else if (!arg.match(/=/)) {
      envDone = true;
      cmd.push(arg);
    } else {
      const [envVar, value] = arg.split('=');
      if (!envVar || !value) {
        exit(`Invalid env var:`, arg);
        return;
      } else {
        env[envVar] = value;
      }
    }
  }

  if (!cmd.length) {
    exit('No command was given');
    return;
  }

  Object.assign(process.env, env);

  const result = spawnSync(cmd[0], cmd.slice(1), { stdio: 'inherit', shell: true });
  process.exitCode = result.status;

  if (process.exitCode) {
    warn();
  }
};

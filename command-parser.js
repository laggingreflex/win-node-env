module.exports = args => {

  args = args.map(a => a.trim()).filter(Boolean);

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

  return { env, cmd };
}

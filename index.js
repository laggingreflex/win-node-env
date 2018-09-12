#!/usr/bin/env node

const foreground = require('foreground-child');

process.argv[2] = 'NODE_ENV' + process.argv[2];
const args = process.argv.slice(2)
// .reduce((args, arg) => args.concat(arg.split(/[ ]+/g)), [])

const env = {};
const cmd = [];
let envDone;
for (const arg of args) {
  if (envDone) {
    cmd.push(arg);
  } else {
    if (!arg.match(/=/)) {
      envDone = true;
      cmd.push(arg);
      continue;
    }
    const [envVar, value] = arg.split('=');
    if (!envVar || !value) {
      envDone = true;
      cmd.push(arg);
      continue;
    }
    env[envVar] = value;
  }
}

Object.assign(process.env, env);

foreground(cmd[0], cmd.slice(1));

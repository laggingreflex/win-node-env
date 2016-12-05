#!/usr/bin/env node

const spawn = require('child_process').spawn

const env = process.argv[2].substr(1)
const cmd = process.argv[3]
const args = process.argv.slice(4)

process.env.NODE_ENV = env

spawn(cmd, args, {
  stdio: 'inherit',
  env: process.env,
  shell: true
})

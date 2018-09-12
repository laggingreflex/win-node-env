#!/usr/bin/env node

const foreground = require('foreground-child')

const env = process.argv[2].substr(1)
const cmd = process.argv[3]
const args = process.argv.slice(4)

process.env.NODE_ENV = env

foreground(cmd, args);

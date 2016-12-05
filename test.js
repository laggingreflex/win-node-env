const assert = require('assert')
const execSync = require('child_process').execSync

// This project should be `npm link`ed
assert.equal('ok', execSync('NODE_ENV=ok node -e "process.stdout.write(process.env.NODE_ENV)"', { encoding: 'utf8' }))

console.log('pass')

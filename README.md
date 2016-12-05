# Win-node-env

If you're on Windows you've probably encountered npm scripts that set NODE_ENV variable before a command, and you know it doesn't work on Windows:

```json
"scripts": {
  "build": "NODE_ENV=production babel src --out-dir dist"
}
```
```batch
'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.
```
You may use [`cross-env`][cross-env] but most projects don't.

## Solution

Win-node-env creates a `NODE_ENV.cmd` that sets the `NODE_ENV` environment variable and spawns a child process with the rest of the command and its args.

## Install
```
npm install -g win-node-env
```
## Usage

Just install it (globally), and run your npm script commands, it should automatically make them work.


[cross-env]: https://www.npmjs.com/package/cross-env

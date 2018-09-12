# win-node-env

Run npm scripts on Windows that set (common) environment variables.

## Problem

If you're on Windows, you've probably encountered an error like:

```batch
'NODE_ENV' is not recognized as an internal or external command, operable program or batch file.
```

which comes from an npm script in your project set up like this:

```json
"scripts": {
  "build": "NODE_ENV=production babel src --out-dir dist"
}
```
Setting `NODE_ENV=production` before command `babel` doesn't work on Windows.

You might use [cross-env] but that involves changing your npm scripts and getting Mac/*nix users onboard.

## Solution

**win-node-env** creates executables like `NODE_ENV.cmd` that sets the `NODE_ENV` environment variable and runs the rest of the command.

## Install

You may install it globally:

```
npm install -g win-node-env
```

Or you may include it in your project's or your library's dependency.

It won't install on any other OS than Windows.

[package.json#os]: https://docs.npmjs.com/files/package.json#os

## Usage

Just install it and run your npm script commands, it should automatically make them work.

```batch
NODE_ENV=production cmd /c echo %NODE_ENV%
```

should output:
```batch
production
```

Apart from `NODE_ENV` there's a few more commonly used env vars:

* `DEBUG`
* `ENV`
* `PORT`

You can also use multiple env vars, as long as the **first one** is one of the above

```batch
NODE_ENV=production MY_VAR=something cmd /c echo %MY_VAR%
```

[cross-env]: https://www.npmjs.com/package/cross-env

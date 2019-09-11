# win-node-env

Run npm scripts on Windows that set (common) environment variables.

<small>Note: Works only in cmd.exe, not in PowerShell. See [#6](../../issues/6)</small>

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

Or you may include it in your project's or your library's optional dependencies:

```
npm install --save-optional win-node-env
```

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
* `NODE_OPTIONS`

You can also use multiple env vars, as long as the **first one** is one of the above

```batch
NODE_ENV=production MY_VAR=something cmd /c echo %MY_VAR%
```

### Bonus

It now also supports `;` character!

```sh
ENV=1 command; command
```

Although any `&&`, `||`, and `&` might break it.

```sh
ENV=1 command && command ; command
^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^^
processed by     not processed by
win-node-env     win-node-env
```

### Tip: to add even more custom variables

If you'd like to add even more custom variable(s) (that you can specify as first) you can do so like this.

Suppose you want to add `MY_VAR`, place a file named `MY_VAR.cmd` where it can be accessed by your command prompt. (when you enter a command in your command prompt, say `MY_VAR`, it looks for a file with the name `MY_VAR.cmd` in a list of pre-defined paths. This list of pre-defined paths resides in the environment variable `PATH`. [You can edit it][edit-env] to include the path containing your `MY_VAR.cmd` file)

[edit-env]: https://www.google.com/search?q=edit+environment+variables+windows

Make sure this module is installed globally.

Then simply put the following code in this file:

* **`MY_VAR.cmd`**

  ```batch
  @ECHO OFF
  SET NODE_PATH=%APPDATA%\npm\node_modules
  node -e "require('win-node-env')('%~n0')" X %*
  ```

  * [`NODE_PATH`](https://nodejs.org/api/cli.html#cli_node_path_path) tells `require` where to look for.

  * `%APPDATA%\npm\node_modules` is generally where your globally installed modules live

  * `%~n0` expands to the current file's name (without extension), i.e. `'MY_VAR'`

  * `X` is a dummy argument that's just needed for some reason

  * `%*` expands all the arguments passed to the batch file, and passes them on to this module

You can use the same contents of this file for any other variable names as well, i.e. just copy this file and change the filename.

[cross-env]: https://www.npmjs.com/package/cross-env

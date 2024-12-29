# args-tokenizer

`args-tokenizer` is a lightweight JavaScript library for parsing shell commands with arguments into an `argv` array. This makes it easy to work with command-line tools and libraries that expect an array format for arguments, such as [`tinyexec`](https://github.com/tinylibs/tinyexec).

## Features

- Simple and intuitive API.
- Handles quoted strings and escapes correctly.
- Supports multiline input.
- Ideal for parsing human-readable shell commands, especially `curl`-style commands.

---

<img src="https://raw.githubusercontent.com/webstudio-is/webstudio-design/refs/heads/main/brand/logo-icon-color.svg" alt="" width="28" height="21" />  Made at <b><a href="https://webstudio.is">Webstudio</a></b>, open source website builder.

---

## Installation

Install `args-tokenizer`:

```bash
npm install args-tokenizer
```

## Usage

Here's how you can use `args-tokenizer` to parse shell commands:

```js
import { tokenizeArgs } from "args-tokenizer";

const args = tokenizeArgs(`ls -la "./src"`);
console.log(args); // ["ls", "-la", "./src"]
```

### Multiline Input Support

`args-tokenizer` also supports multiline commands, such as:

```js
const args = tokenizeArgs(`
  curl \\
    -X POST \\
    "https://my-url.com"
`);
console.log(args); // ["curl", "-X", "POST", "https://my-url.com"]
```

### Example with `tinyexec`

One common use case is passing more human-readable commands into the [`tinyexec`](https://github.com/tinylibs/tinyexec) library:

```js
import { tokenizeArgs } from "args-tokenizer";
import { x } from "tinyexec";

const [command, ...args] = tokenizeArgs("ls -la");
const result = await x(command, args);
console.log(result.stdout);
```

## API

### `tokenizeArgs(command: string, options: Options): string[]`

Parses a shell command string into an array of arguments. Properly handles:

- Quoted strings (e.g., `'"./path/to/file"'`).
- Escaped characters (e.g., `\"`).
- Multiline commands (e.g., lines ending with `\\`).

### Options

- `loose`: If `true`, the tokenizer will not throw an error when closing quotes are missing. Default is `false`.

#### Examples

```js
// Without loose option (default behavior)
// This will throw an error due to the missing closing quote
tokenizeArgs('command "arg1 arg2');

// With loose option enabled
const args = tokenizeArgs('command "arg1 arg2', { loose: true });
// ['command', 'arg1 arg2']
```

## License

This project is licensed under the [MIT License](./LICENSE).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the library.

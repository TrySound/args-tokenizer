import { expect, test } from "vitest";
import { tokenizeArgs } from "./args-tokenizer";

test("single command", () => {
  expect(tokenizeArgs("command")).toEqual(["command"]);
});

test("space separated arguments", () => {
  expect(tokenizeArgs(`command \targument`)).toEqual(["command", "argument"]);
});

test("quoted arguments", () => {
  expect(tokenizeArgs(`command 'argument1' "argument2"`)).toEqual([
    "command",
    "argument1",
    "argument2",
  ]);
});

test("inconsistently quoted arguments", () => {
  expect(tokenizeArgs(`command "arg"um"en"t`)).toEqual(["command", "argument"]);
});

test("detects incomplete quotes ", () => {
  expect(() => {
    tokenizeArgs(`command "arg1 "arg2" "arg3"`);
  }).toThrow("Unexpected end of string. Closing quote is missing.");
});

test("forgive incomplete quotes in loose mode", () => {
  expect(tokenizeArgs(`command "arg1 "arg2" "arg3"`, { loose: true })).toEqual([
    "command",
    "arg1 arg2 arg3",
  ]);
});

test("escape quotes and spaces with other quotes", () => {
  expect(tokenizeArgs(`command 'quote "' "quote '"`)).toEqual([
    "command",
    'quote "',
    "quote '",
  ]);
});

test("escape quotes with backslashes", () => {
  expect(tokenizeArgs(`command "project \\"argument\\""`)).toEqual([
    "command",
    'project "argument"',
  ]);
});

test("escape spaces with backslashes", () => {
  expect(tokenizeArgs(`command space\\ `)).toEqual(["command", "space "]);
});

test("ignore escaped newlines outside of quotes", () => {
  expect(tokenizeArgs(`command \\\nargument`)).toEqual(["command", `argument`]);
  expect(tokenizeArgs(`command "\\\nargument"`)).toEqual([
    "command",
    `\nargument`,
  ]);
});

test("flag argument", () => {
  expect(tokenizeArgs(`command --argument`)).toEqual(["command", "--argument"]);
});

test("flag argument with value", () => {
  expect(tokenizeArgs(`command --argument="value"`)).toEqual([
    "command",
    `--argument=value`,
  ]);
});

test("json argument", () => {
  expect(tokenizeArgs(`command '{ "param": "value" }'`)).toEqual([
    "command",
    `{ "param": "value" }`,
  ]);
});

test("multiline input", () => {
  expect(
    tokenizeArgs(`
      command \\
        --flag=1 \\
        "argument"
    `),
  ).toEqual(["command", "--flag=1", "argument"]);
});

test("multiline argument", () => {
  expect(
    tokenizeArgs(`command "query Posts {
  posts {
    slug
    title
    updatedAt
    excerpt
  }
}"`),
  ).toEqual([
    "command",
    `query Posts {
  posts {
    slug
    title
    updatedAt
    excerpt
  }
}`,
  ]);
});

test("empty command", () => {
  expect(tokenizeArgs(``)).toEqual([]);
  expect(tokenizeArgs(`  `)).toEqual([]);
});

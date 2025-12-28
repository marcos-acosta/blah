# blah

A CLI for journaling.

## Installation

Global install:

```sh
npm install -g @marcos-acosta/blah
blah
```

Or run with `npx`:

```sh
npx @marcos-acosta/blah
```

I personally find an alias useful, as I run it every day:

```sh
alias b=blah
```

## Configuration

When run for the first time, `blah` will prompt you for a location to store your entries. The configuration file is stored at `.blah.toml` in your home directory and can be modified any time. Journal entries are stored in newline-delimited JSON (`blah.ndjson`).

## Usage

- `a` to add a journal entry
  - `esc` to return home
  - `enter` to submit
- `e` to browse entries
  - `esc` to return home
  - `up/down` or `j/k` to go back/forward
  - `w/W` to go forward/backward one week
  - `m/M` to go forward/backward thirty days
  - `y/Y` to go forward/backward one year
  - `enter` to enter entry view (`esc` to return to list view)
    - Navigation commands can still be used in entry view
  - `/` to grep
    - `esc` to cancel grep
    - `enter` to confirm grep
- `q` or `esc` to quit

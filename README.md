# dice.sh

A simple online console-like dice roller available at [https://dice.sh](https://dice.sh).

## Roadmap

I've created a quick MVP to see if I end up liking using this. Here's some other things I thought could be useful:

* `Ctrl+R` to do a fuzzy history search.
* Save all prompts to local storage so they're searchable.
    * *Some details:* Currently the history is just what's on the screen and it's stored in session storage. But I want there to be an additional log of just the user's inputs in local storage that can be searched through.
* Add a server backend to allow saving history there and hosting shared sessions.
* Create alternate interfaces:
    * An actual command line version you can run locally, similar to my [die-sim](https://github.com/itsjohncs/die-sim).
    * Allow connecting via telnet.
    * Allow connecting via ssh.
* Allow choosing color scheme and font.

If you're interested in working on any of this please reach out! You can find me on [Twitter](https://x.com/itsjohncs), [Mastodon](https://tech.lgbt/@johncs), or even [Shmeppy's Discord](https://discord.gg/Q246DD5).

The repository and codebase could also use some love to transform it from a two-day hack to something to be built upon.

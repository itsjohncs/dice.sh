#!/usr/bin/env bash

set -ue

SCRIPT_DIR="$(
    cd "$(dirname "${BASH_SOURCE[0]}")"
    pwd -P
)"

set -x
git config --local core.hooksPath "$SCRIPT_DIR/git-hooks"

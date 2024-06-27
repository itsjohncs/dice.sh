import {Linter} from "eslint";
import {fixupConfigRules} from "@eslint/compat";

import node from "@vercel/style-guide/eslint/node";
import typescript from "@vercel/style-guide/eslint/typescript";
import browser from "@vercel/style-guide/eslint/browser";
import react from "@vercel/style-guide/eslint/react";
import next from "@vercel/style-guide/eslint/next";

export default [
    ...fixupConfigRules([node, typescript, browser, react, next]),
] satisfies Linter.FlatConfig[];

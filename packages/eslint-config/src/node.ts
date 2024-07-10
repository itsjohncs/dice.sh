import tseslint from "typescript-eslint";
import globals from "globals";

import base from "./base";

export default tseslint.config(...base, {
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
});

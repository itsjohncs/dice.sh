import base from "./base";
import reactRecommended from "eslint-plugin-react/configs/recommended";

export default [
    ...base,
    {
        ignores: [".next", "eslint.config.js"],
    },
    {
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        plugins: reactRecommended.plugins,
        rules: {
            ...reactRecommended.rules,
            "react/react-in-jsx-scope": "off",
        },
    },
];

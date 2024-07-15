declare module "eslint-plugin-react/configs/recommended" {
    const foo: import("eslint").Linter.FlatConfig;
    export default foo;
}

declare module "eslint-plugin-unused-imports" {
    const foo: import("eslint").ESLint.Plugin;
    export default foo;
}

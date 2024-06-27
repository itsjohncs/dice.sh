declare module "@vercel/style-guide/*" {
    const foo: import("eslint").Linter.FlatConfig;
    export default foo;
}

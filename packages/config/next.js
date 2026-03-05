/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "next/core-web-vitals",
        "./index.js",
    ],
    rules: {
        "react/no-unescaped-entities": "off",
        "@next/next/no-html-link-for-pages": "off",
    },
};

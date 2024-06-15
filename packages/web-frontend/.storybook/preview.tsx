import React from "react";
import type {Preview} from "@storybook/react";
import {Source_Code_Pro} from "next/font/google";

const font = Source_Code_Pro({
    subsets: ["latin"],
    display: "swap",
});

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        function (Story) {
            return (
                <div className={font.className}>
                    <Story />
                </div>
            );
        },
    ],
};

export default preview;

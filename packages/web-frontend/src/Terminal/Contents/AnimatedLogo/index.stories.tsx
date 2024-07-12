import type {Meta, StoryObj} from "@storybook/react";
import AnimatedLogo from ".";

const meta = {
    title: "AnimatedLogo",
    component: AnimatedLogo,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof AnimatedLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {};

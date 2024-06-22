import type { Meta, StoryObj } from "@storybook/react";
import { WButton } from "./WButton";

import { within } from "@storybook/test";
import { expect } from "@storybook/test";

const meta: Meta<typeof WButton> = {
  component: WButton,
  title: "WButton",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof WButton>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to WButton!/gi)).toBeTruthy();
  },
};

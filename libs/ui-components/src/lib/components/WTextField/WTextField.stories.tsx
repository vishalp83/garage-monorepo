import type { Meta, StoryObj } from "@storybook/react";
import { WTextField } from "./WTextField";

import { within } from "@storybook/test";
import { expect } from "@storybook/test";

const meta: Meta<typeof WTextField> = {
  component: WTextField,
  title: "WTextField",
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof WTextField>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to WTextField!/gi)).toBeTruthy();
  },
};

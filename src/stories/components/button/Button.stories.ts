import { Button } from './button';
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',            // Centraliza o componente no Canvas
  },
  tags: ['autodocs'],              // Gera docs automáticos
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    onClick: action('onClick'),    // Exibe no painel de ações
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

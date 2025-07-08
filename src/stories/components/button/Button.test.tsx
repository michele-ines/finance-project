import React from 'react'; // ✅ necessário para JSX
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  it('renders with the given label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies the primary class when primary is true', () => {
    render(<Button label="Primary" primary />);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/storybook-button--primary/);
  });

  it('applies the correct size class', () => {
    render(<Button label="Large Button" size="large" />);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/storybook-button--large/);
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets inline backgroundColor style if provided', () => {
    render(<Button label="Styled Button" backgroundColor="#ff0000" />);
    const button = screen.getByRole('button');
    expect(button).toHaveStyle({ backgroundColor: '#ff0000' });
  });
});

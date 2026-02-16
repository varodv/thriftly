import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout', () => {
  beforeAll(() => {
    // Mock window.matchMedia for ThemeProvider
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should render its children', () => {
    render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>,
    );

    const child = screen.getByTestId('child');
    expect(child).toBeDefined();
    expect(child.textContent).toBe('Test Child');
  });
});

import { render, screen } from '@testing-library/react';
import Page from './page';

describe('/', () => {
  it('should render its content', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { level: 1, name: 'thriftly' })).toBeDefined();
  });
});

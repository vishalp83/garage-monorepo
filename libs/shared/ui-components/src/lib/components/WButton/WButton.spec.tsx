import { render } from '@testing-library/react';

import WButton from './WButton';

describe('WButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WButton />);
    expect(baseElement).toBeTruthy();
  });
});

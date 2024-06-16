import { render } from '@testing-library/react';

import WTextField from './WTextField';

describe('WTextField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WTextField />);
    expect(baseElement).toBeTruthy();
  });
});

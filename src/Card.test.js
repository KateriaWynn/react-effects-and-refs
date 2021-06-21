import React from 'react';
import { render } from '@testing-library/react';
import Card from './Card';

// smoke test
test('if Card renders without crashing', () => {
  render(<Card />);
});

// snapshot test
test('if Card matches snapshot', () => {
  const { asFragment } = render(<Card />);
  expect(asFragment()).toMatchSnapshot();
});

import React from 'react';
import App from './App';
import { render } from '@testing-library/react';

// smoke test
test('if App renders without crashing', () => {
  render(<App />);
});

// snapshot test
test('if App matches snapshot', () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});

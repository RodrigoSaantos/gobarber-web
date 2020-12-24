import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SingIn from '../../pages/SignIn';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: jest.fn(),
    }),
  };
});

describe('SingIn Page', () => {
  it('Should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SingIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'rodrigo@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '12345678' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});

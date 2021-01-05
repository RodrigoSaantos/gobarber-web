import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SingIn from '../../pages/SignIn';

const mockHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

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
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SingIn Page', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear();
  });

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

  it('Should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SingIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '12345678' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('Should display an error if logins fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SingIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'rodrigo@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '12345678' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});

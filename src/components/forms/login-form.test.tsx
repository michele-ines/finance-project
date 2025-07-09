// src/components/forms/login-form.test.tsx
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

/* ------------------------------------------------------------------
 * 1) Mocks declarados *antes* do import do componente
 * -----------------------------------------------------------------*/
jest.mock("next/font/google", () => ({
  __esModule: true,
  // cada fonte precisa ser uma função
  Inter: jest.fn(() => ({ className: "mock-inter-font" })),
  Roboto: jest.fn(() => ({ className: "mock-roboto-font" })),
  Roboto_Mono: jest.fn(() => ({ className: "mock-roboto-mono-font" })),
}));

// estes dois continuam virtuais porque o alias não é resolvido pelo Jest
jest.mock(
  "config-routes/routes",
  () => ({
    ROUTES: { FORGOT_PASSWORD: "/mock-forgot" },
  }),
  { virtual: true }
);

jest.mock(
  "utils/forms-validations/formValidations",
  () => ({
    loginValidations: {
      email: {
        required: "O campo de e-mail é obrigatório.",
        pattern: {
          value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
          message: "Digite um e-mail válido.",
        },
      },
      password: {
        required: "O campo de senha é obrigatório.",
        minLength: {
          value: 6,
          message: "A senha deve ter ao menos 6 caracteres.",
        },
      },
    },
  }),
  { virtual: true }
);

/* ------------------------------------------------------------------
 * 2) Agora importamos o componente
 * -----------------------------------------------------------------*/
import LoginForm from "./login-form";

/* ------------------------------------------------------------------
 * 3) Casos de teste (iguais)
 * -----------------------------------------------------------------*/
describe("LoginForm", () => {
  it("renderiza inputs e botão inicialmente", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("textbox", { name: /e-mail/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /acessar/i })
    ).toBeInTheDocument();
  });

  it('exibe erros “campo obrigatório” quando submete vazio', async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /acessar/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/Email é obrigatório/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Senha é obrigatória/i)
    ).toBeInTheDocument();
  });
  it('exibe erro de e-mail inválido quando formato está errado', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole('button', { name: /acessar/i });

    await userEvent.type(emailInput, 'email-invalido');
    await userEvent.click(submitButton);

    // CORRIGIDO: Use a mensagem de erro que realmente aparece
    expect(
      await screen.findByText(/Formato de email inválido/i)
    ).toBeInTheDocument();
  });

  it("alterna visibilidade da senha", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/^senha$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.type(passwordInput, "123456"); // faz o botão aparecer

    const toggleBtn = screen.getByRole("button", { name: /mostrar senha/i });
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("mostra texto “Acessando…” enquanto envia e reabilita depois", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<LoginForm />);

    await user.type(
      screen.getByRole("textbox", { name: /e-mail/i }),
      "user@example.com"
    );
    await user.type(screen.getByLabelText(/^senha$/i), "123456");
    await user.click(screen.getByRole("button", { name: /acessar/i }));

    const busyBtn = screen.getByRole("button", { name: /acessando/i });
    expect(busyBtn).toBeDisabled();

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /acessar/i })).toBeEnabled()
    );

    jest.useRealTimers();
  });
});

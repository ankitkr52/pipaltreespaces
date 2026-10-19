import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CallbackForm } from '@/components/forms/CallbackForm';

const good = {
  name: 'Ravi Kumar',
  phone: '9876543210',
  email: 'ravi@example.com',
  message: 'I would like a callback about 3BHK in Boring Road.',
};

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name$/i), good.name);
  await user.type(screen.getByLabelText(/^phone$/i), good.phone);
  await user.type(screen.getByLabelText(/^email$/i), good.email);
  await user.type(screen.getByLabelText(/^message$/i), good.message);
}

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn();
});
afterEach(() => {
  global.fetch = originalFetch;
});

describe('CallbackForm', () => {
  it('blank name shows inline error (fetch not called)', async () => {
    const user = userEvent.setup();
    render(<CallbackForm />);
    await user.click(screen.getByRole('button', { name: /request callback/i }));
    expect(await screen.findByText(/at least 2/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('200 shows success toast', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    const user = userEvent.setup();
    render(<CallbackForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /request callback/i }));
    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent(/thanks/i);
  });

  it('400 shows server field errors', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: false,
          error: 'validation',
          issues: [{ path: ['email'], message: 'email already blocked' }],
        }),
        { status: 400 },
      ),
    );
    const user = userEvent.setup();
    render(<CallbackForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /request callback/i }));
    expect(await screen.findByText(/email already blocked/i)).toBeInTheDocument();
  });

  it('429 shows rate-limit message', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: 'rate-limit' }), { status: 429 }),
    );
    const user = userEvent.setup();
    render(<CallbackForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /request callback/i }));
    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
  });

  it('renders mailto fallback link', () => {
    render(<CallbackForm />);
    const mailto = screen.getByRole('link');
    expect(mailto.getAttribute('href')).toMatch(/^mailto:/);
  });
});

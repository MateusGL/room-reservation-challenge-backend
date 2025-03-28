export const AuthMocks = {
  validUser: () => ({
    email: 'user@test.com',
    password: 'validPassword123!',
    name: 'Test User',
  }),

  invalidUser: () => ({
    email: 'invalid@test.com',
    password: 'short',
    name: 'Invalid User',
  }),

  loginCredentials: (email?: string) => ({
    email: email || 'user@test.com',
    password: 'validPassword123!',
  }),
};

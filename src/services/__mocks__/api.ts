export const authApi = {
  login: jest.fn(),
  loginWithCredentials: jest.fn().mockResolvedValue({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    token: 'fake-jwt-token',
  }),
  register: jest.fn().mockResolvedValue({
    user: { id: '2', name: 'New User', email: 'new@example.com' },
    token: 'fake-jwt-token',
  }),
  logout: jest.fn(),
}; 
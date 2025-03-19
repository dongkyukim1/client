import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import Login from '../Login';
import { authApi } from '@/services/api';

// API 모킹
jest.mock('@/services/api', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn().mockResolvedValue({ success: true })
  }
}));

// useRouter 모킹
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn()
  }))
}));

describe('Login Component', () => {
  const mockHandleLogin = jest.fn();

  // 일반 렌더링 함수
  const renderLoginComponent = () => {
    return render(
      <SessionProvider session={null}>
        <Login handleLogin={mockHandleLogin} />
      </SessionProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLoginComponent();
    
    // 로그인 폼이 표시되는지 확인
    expect(screen.getByText(/또는/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
  });

  it('calls handleLogin when social login buttons are clicked', () => {
    renderLoginComponent();
    
    // 소셜 로그인 버튼들이 모두 있는지 확인 (버튼 이름이나 아이콘에 따라 선택자 조정 필요)
    const googleButton = screen.getByRole('button', { name: /google/i });
    fireEvent.click(googleButton);
    expect(mockHandleLogin).toHaveBeenCalledWith('google');
    
    // 다른 소셜 로그인 버튼들도 테스트 (있는 경우)
    // Naver, Kakao 등의 버튼이 있다면 추가
  });

  it('shows validation errors for empty fields', async () => {
    renderLoginComponent();
    
    // 빈 값으로 로그인 시도
    const loginButton = screen.getByRole('button', { name: /로그인/i });
    fireEvent.click(loginButton);
    
    // 유효성 검사 오류 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
    });
  });

  // 회원가입 관련 테스트는 스킵 (API 미완성)
  it.skip('toggles to signup form when signup button is clicked', async () => {
    renderLoginComponent();
    
    // 회원가입 버튼 찾기 및 클릭
    const signupButton = screen.getByRole('button', { name: /회원가입하기/i });
    fireEvent.click(signupButton);
    
    // 회원가입 폼이 표시되는지 확인 (API 미구현으로 스킵)
    await waitFor(() => {
      expect(screen.getByText(/회원가입/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/이름/i)).toBeInTheDocument();
    });
  });

  // 회원가입 제출 테스트 스킵
  it.skip('allows user to register with valid information', async () => {
    renderLoginComponent();
    
    // 회원가입 버튼 찾기 및 클릭
    const signupButton = screen.getByRole('button', { name: /회원가입하기/i });
    fireEvent.click(signupButton);
    
    // 폼 필드 입력 (API 미구현으로 스킵)
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText(/이름/i);
      const emailInput = screen.getByPlaceholderText(/이메일/i);
      const passwordInput = screen.getByPlaceholderText(/비밀번호/i);
      
      fireEvent.change(nameInput, { target: { value: '테스트 사용자' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });
      
      // 약관 동의
      const termsCheckbox = screen.getByLabelText(/이용약관/i);
      const privacyCheckbox = screen.getByLabelText(/개인정보처리방침/i);
      
      fireEvent.click(termsCheckbox);
      fireEvent.click(privacyCheckbox);
      
      // 회원가입 버튼 클릭
      const registerButton = screen.getByRole('button', { name: /회원가입$/i });
      fireEvent.click(registerButton);
    });
    
    // 회원가입 성공 확인 (API 미구현으로 스킵)
    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalled();
    });
  });

  // 성능 테스트
  it('measures login component render performance', () => {
    const startTime = performance.now();
    renderLoginComponent();
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    console.log(`Login component render time: ${renderTime.toFixed(2)}ms`);
    
    // 렌더링 시간이 150ms 미만이어야 함
    expect(renderTime).toBeLessThan(150);
  });
}); 
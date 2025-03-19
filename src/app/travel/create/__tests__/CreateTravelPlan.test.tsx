import { render, screen } from '@testing-library/react';
import CreateTravelPlan from '../page';
import { startMeasure, endMeasure } from '@/utils/performance';

// next/navigation의 useRouter 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Layout 컴포넌트 모킹
jest.mock('@/components/Layout', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="layout">{children}</div>,
  };
});

describe('CreateTravelPlan Component', () => {
  it('renders the component', () => {
    startMeasure('render_CreateTravelPlan');
    
    render(<CreateTravelPlan />);
    
    endMeasure('render_CreateTravelPlan');
    
    // 첫 단계의 제목이 표시되는지 확인
    expect(screen.getByText(/어디로 떠나시나요/i)).toBeInTheDocument();
  });
}); 
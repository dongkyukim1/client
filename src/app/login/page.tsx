"use client";

import { Container, useColorMode } from "@chakra-ui/react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/services/api";
import { FaGoogle, FaGithub } from "react-icons/fa";
import Modal from "@/components/Modal";

// 동적 임포트로 변경 (코드 분할)
const TermsContent = lazy(() => import('@/components/TermsContent'));
const PrivacyContent = lazy(() => import('@/components/PrivacyContent'));

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [termsPreloaded, setTermsPreloaded] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  const handleLogin = (provider: string) => {
    authApi.login(provider);
  };

  // useCallback으로 핸들러 최적화
  const openTermsModal = useCallback(() => setIsTermsModalOpen(true), []);
  const closeTermsModal = useCallback(() => setIsTermsModalOpen(false), []);
  
  const openPrivacyModal = useCallback(() => setIsPrivacyModalOpen(true), []);
  const closePrivacyModal = useCallback(() => setIsPrivacyModalOpen(false), []);

  // 모달 버튼 스타일
  const modalButtonStyle = "text-blue-500 hover:text-blue-600 font-medium focus:outline-none focus:underline transition-colors bg-transparent border-0";

  // 마우스가 버튼 위로 올라가면 컴포넌트 미리 로드
  const handleTermsHover = () => {
    if (!termsPreloaded) {
      const preload = import('@/components/TermsContent');
      setTermsPreloaded(true);
    }
  };

  if (status === "loading") {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <Container maxW="md" centerContent>
          <Card
            className={`w-100 border-0 ${
              colorMode === "dark" ? "bg-dark text-white" : "bg-white"
            }`}
            style={{
              maxWidth: "460px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
              borderRadius: "16px",
            }}
          >
            <Card.Header className="text-center border-bottom-0 bg-transparent pt-5 pb-4">
              <h1
                style={{
                  fontSize: "2rem",
                  color: "#4A90E2",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                }}
              >
              Trip Planner AI
              </h1>
            </Card.Header>

            <Card.Body className="px-5 py-4">
              <Row className="g-4">
                <Col xs={12}>
                  <Button
                    variant={
                      colorMode === "dark"
                        ? "outline-light"
                        : "outline-secondary"
                    }
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      fontSize: "15px",
                      borderRadius: "10px",
                      backgroundColor: colorMode === "dark" ? "#333" : "#fff",
                      border: "1px solid #dadada",
                      height: "52px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleLogin("google")}
                  >
                    <FaGoogle size={18} style={{ color: "#EA4335" }} />
                    <span>Google 계정으로 로그인</span>
                  </Button>
                </Col>

                <Col xs={12}>
                  <Button
                    variant={
                      colorMode === "dark"
                        ? "outline-light"
                        : "outline-secondary"
                    }
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      fontSize: "15px",
                      borderRadius: "10px",
                      backgroundColor: colorMode === "dark" ? "#333" : "#fff",
                      border: "1px solid #dadada",
                      height: "52px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleLogin("github")}
                  >
                    <FaGithub size={18} />
                    <span>GitHub 계정으로 로그인</span>
                  </Button>
                </Col>
              </Row>

              {/* 이용약관 동의 문구 */}
              <div className="text-center text-sm text-gray-500 mt-4">
                로그인하면{' '}
                <button 
                  onMouseEnter={handleTermsHover}
                  onClick={openTermsModal} 
                  className={modalButtonStyle}
                >
                  이용약관
                </button>
                {' '}및{' '}
                <button 
                  onClick={openPrivacyModal} 
                  className={modalButtonStyle}
                >
                  개인정보처리방침
                </button>
                에 동의하게 됩니다.
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* 이용약관 모달 */}
      {isTermsModalOpen && (
        <Modal 
          isOpen={true} 
          onClose={closeTermsModal}
          title="이용약관"
        >
          <TermsContent />
        </Modal>
      )}

      {/* 개인정보처리방침 모달 */}
      <Modal 
        isOpen={isPrivacyModalOpen} 
        onClose={closePrivacyModal}
        title="개인정보처리방침"
      >
        <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
          <PrivacyContent />
        </Suspense>
      </Modal>
    </Layout>
  );
}

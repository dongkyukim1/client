"use client";

import { Container, useColorMode } from "@chakra-ui/react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { authApi } from "@/services/api";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  const handleLogin = (provider: string) => {
    authApi.login(provider);
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
                AI Resume
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

              <div
                className="mt-4 pt-4 text-center"
                style={{ borderTop: "1px solid #eaeaea" }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "#888",
                    lineHeight: "1.5",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  로그인하면{" "}
                  <a
                    href="#"
                    style={{
                      color: "#4A90E2",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    이용약관
                  </a>{" "}
                  및{" "}
                  <a
                    href="#"
                    style={{
                      color: "#4A90E2",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    개인정보처리방침
                  </a>
                  에 동의하게 됩니다.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </Layout>
  );
}

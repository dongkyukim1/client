import { http, HttpResponse } from 'msw'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const members = [
  {
    id: 1,
    nickname: "test01",
    email: "test01@email.com",
    password: "test01",
    phone: "01012345678",
    refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJlbWFpbFwiOlwidGVzdDAxQGVtYWlsLmNvbVwiLFwibmlja25hbWVcIjpcInRlc3QwMVwiLFwidXJsXCI6bnVsbH0iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MzEzMzQ0NiwiZXhwIjoxNzQ0OTMzNDQ2fQ.hRZpgxtWC_rQG4KlAOBzbVEcvnv8o-CeRiyCLkr_KY8",
  },
  {
    id: 2,
    nickname: "test02",
    email: "test02@email.com",
    password: "test02",
    phone: "01012345678",
    refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ7XCJlbWFpbFwiOlwidGVzdDAxQGVtYWlsLmNvbVwiLFwibmlja25hbWVcIjpcInRlc3QwMVwiLFwidXJsXCI6bnVsbH0iLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MzEzMzQ0NiwiZXhwIjoxNzQ0OTMzNDQ2fQ.hRZpgxtWC_rQG4KlAOBzbVEcvnv8o-CeRiyCLkr_KY8",
  },
]

export const handlers = [
  // 이메일 중복 체크
  http.post(`${API_URL}/email-check`, async ({ request }) => {
    const { email } = await request.json();
    const isExist = members.some(m => m.email === email);

    const success = HttpResponse.json({
      code: "SU",
      message: "Success",
    })

    const fail = HttpResponse.json({
      code: "FA",
      message: "duplicate email",
    })

    return isExist ? fail : success;
  }),

  // 인증 번호 확인
  http.post(`${API_URL}/certification`, async ({ request }) => {
    const { certification } = await request.json();
    const success = HttpResponse.json({
      code: "SU",
      message: "Success",
    })

    const fail = HttpResponse.json({
      code: "FA",
      message: "Failed certification",
    })

    return certification === "1234" ? success : fail;
  }),


  // 회원 정보 가져오기
  http.post(`${API_URL}/member`, async ({ request }) => {
    const { email } = await request.json();

    const success = HttpResponse.json({
      code: "SU",
      message: "Success",
      id: 9007199254740991,
      email: "test01@email.com",
      nickname: "양파",
      phoneNumber: "01012345678",
      provider: "provider",
      providerId: "providerId",
      imageUrl: "imageUrl",
      customerKey: "customerKey",
      withdrawn: true
    })

    const fail = HttpResponse.json({
      code: "FA",
      message: "Fail",
    })

    return false ? fail : success;
  }),

]
import { http, HttpResponse } from "msw";

let userData = {
  id: 1,
  name: "우기",
  role: "프론트엔드 개발자",
};

const baseUrl = "http://localhost:5173";
const VALID_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const checkAuth = (request: Request) => {
  const authHeader = request.headers.get("Authorization");
  return authHeader === `Bearer ${VALID_TOKEN}`;
};

const unauthorizedResponse = () =>
  HttpResponse.json(
    { message: "인증되지 않은 사용자입니다." },
    { status: 401 }
  );

export const handlers = [
  http.post(`${baseUrl}/api/v1/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as any;

    if (username === "admin" && password === "123") {
      return HttpResponse.json({
        success: true,
        accessToken: VALID_TOKEN,
      });
    }

    return HttpResponse.json(
      { success: false, message: "아이디/비밀번호가 틀렸습니다." },
      { status: 401 }
    );
  }),

  http.get(`${baseUrl}/api/v1/user`, ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse();

    return HttpResponse.json(userData);
  }),

  http.patch(`${baseUrl}/api/v1/user`, async ({ request }) => {
    if (!checkAuth(request)) return unauthorizedResponse();

    const newUserData = (await request.json()) as any;
    userData = {
      ...userData,
      ...newUserData,
    };

    return HttpResponse.json(userData);
  }),
];

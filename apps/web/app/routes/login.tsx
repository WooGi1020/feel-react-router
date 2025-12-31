import { Form, useActionData, useNavigation, redirect } from "react-router";
import type { Route } from "./+types/login";
import {
  createSession,
  getSessionData,
  redirectWithFlash,
} from "../services/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { accessToken } = await getSessionData(request);
  if (accessToken) {
    throw await redirectWithFlash(request, "/", "이미 로그인된 상태입니다.");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const res = await fetch("http://localhost:5173/api/v1/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "Login failed" }));
      return { error: errorData.message };
    }

    const data = await res.json();
    return await createSession(request, data.accessToken);
  } catch (e) {
    return { error: "서버 연결에 실패했습니다. MSW 설정을 확인하세요." };
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">환영합니다</h1>
          <p className="text-sm text-gray-500 mt-2">
            서비스를 이용하려면 로그인하세요
          </p>
        </div>

        <Form method="post" className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 ml-1">
              아이디
            </label>
            <input
              type="text"
              name="username"
              placeholder="user"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 ml-1">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {actionData?.error && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 text-center">
                {actionData.error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </Form>
      </div>
    </div>
  );
}

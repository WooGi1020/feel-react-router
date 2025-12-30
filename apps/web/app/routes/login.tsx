import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import { createSession } from "../services/auth.server";

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
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="">
      <Form method="post">
        <input type="text" name="username" placeholder="ID" required />
        <input type="password" name="password" placeholder="PW" required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}

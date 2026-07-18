import { SignIn } from "@clerk/nextjs";
import "../../dashboard/dashboard.css";

export const metadata = { title: "Sign in — Alfred" };

export default function SignInPage() {
  return (
    <div className="auth-screen">
      <SignIn />
    </div>
  );
}

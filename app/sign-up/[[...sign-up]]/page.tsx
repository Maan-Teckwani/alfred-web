import { SignUp } from "@clerk/nextjs";
import "../../dashboard/dashboard.css";

export const metadata = { title: "Sign up — Alfred" };

export default function SignUpPage() {
  return (
    <div className="auth-screen">
      <SignUp />
    </div>
  );
}

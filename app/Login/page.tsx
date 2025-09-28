import { LoginForm } from "@/components/login"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 page-content">
      <div className="flex w-full max-w-sm flex-col gap-6 page-stagger">
        <LoginForm />
      </div>
    </div>
  )
}

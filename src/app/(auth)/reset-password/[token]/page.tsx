import ResetPasswordForm from "./reset-form";

interface ResetPasswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function Page({ params }: ResetPasswordPageProps) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}

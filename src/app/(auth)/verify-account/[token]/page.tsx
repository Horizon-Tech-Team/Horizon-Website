import VerifyAccountPage from "./verify-account-page";

interface VerifyPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function Page({ params }: VerifyPageProps) {
  const { token } = await params;
  return <VerifyAccountPage token={token} />;
}

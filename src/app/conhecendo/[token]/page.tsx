import { notFound } from "next/navigation";
import { validateInviteToken } from "@/services/settings.service";
import { KnowingExperience } from "@/components/form/KnowingExperience";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valid = await validateInviteToken(token);

  if (!valid) {
    notFound();
  }

  return (
    <div className="min-h-dvh gwen-noise">
      <KnowingExperience token={token} />
    </div>
  );
}

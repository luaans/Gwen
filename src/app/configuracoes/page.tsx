import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/layout/PageTransition";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { getSettingsDTO } from "@/services/settings.service";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const settings = await getSettingsDTO();

  return (
    <AppShell title="Configurações">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl tracking-tight">
              Configurações
            </h1>
            <p className="mt-2 text-muted">
              O espaço da Gwen, do seu jeito.
            </p>
          </div>
          <SettingsClient
            ownerDisplayName={settings.ownerDisplayName}
            inviteToken={settings.formInviteToken}
            widgetToken={settings.widgetToken}
          />
        </div>
      </PageTransition>
    </AppShell>
  );
}

import { listPeople, countPeople } from "./person.service";
import { getRecentQuestionnaires } from "./questionnaire.service";
import { getInviteToken } from "./settings.service";
import type { DashboardData } from "@/types";

export async function getDashboardData(search?: string): Promise<DashboardData> {
  const [people, peopleCount, recentQuestionnaires, inviteToken] =
    await Promise.all([
      listPeople(search),
      countPeople(),
      getRecentQuestionnaires(5),
      getInviteToken(),
    ]);

  return {
    peopleCount,
    recentQuestionnaires,
    recentPeople: people.slice(0, 5),
    people,
    inviteToken,
  };
}

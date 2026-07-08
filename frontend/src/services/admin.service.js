import { getLeadStats } from "./leads.service";

export const getAdminOverview = async () => {
  const leadStats = await getLeadStats();
  return { leadStats };
};

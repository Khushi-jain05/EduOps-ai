import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import LeadsHeader from "../../components/admin/leads/LeadsHeader";
import LeadsStatCards from "../../components/admin/leads/LeadsStatCards";
import LeadsTabs from "../../components/admin/leads/LeadsTabs";
import AddLeadModal from "../../components/admin/leads/AddLeadModal";
import OverviewTab from "../../components/admin/leads/tabs/OverviewTab";
import AllLeadsTab from "../../components/admin/leads/tabs/AllLeadsTab";
import WhatsAppAutomationTab from "../../components/admin/leads/tabs/WhatsAppAutomationTab";
import AiCallingAgentsTab from "../../components/admin/leads/tabs/AiCallingAgentsTab";
import GoogleSheetsTab from "../../components/admin/leads/tabs/GoogleSheetsTab";
import LeadScoringTab from "../../components/admin/leads/tabs/LeadScoringTab";
import CampaignsTab from "../../components/admin/leads/tabs/CampaignsTab";
import ActivityTab from "../../components/admin/leads/tabs/ActivityTab";

import { getLeads, getLeadStats, getLeadScoring, getLeadActivity } from "../../services/leads.service";
import { getAgents, getCallStats, getQueue } from "../../services/callAgents.service";
import { getCampaigns } from "../../services/campaigns.service";
import { getTemplates } from "../../services/whatsapp.service";
import { getSheetStatus } from "../../services/googleSheets.service";

export default function Leads() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);
  const [loading, setLoading] = useState(true);

  // A search coming from the global navbar (?q=) prefills the lead search and
  // jumps straight to the All Leads table.
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearch(q);
      setActiveTab("all-leads");
    }
  }, [searchParams]);

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads30d: 0,
    hotLeads: 0,
    enrolledThisMonth: 0,
    conversionRate: 0,
  });
  const [scoring, setScoring] = useState([]);
  const [activity, setActivity] = useState([]);
  const [agents, setAgents] = useState([]);
  const [callStats, setCallStats] = useState({
    callsToday: 0,
    connectedRate: 0,
    avgHandleSeconds: 0,
    hotHandoffs: 0,
  });
  const [queue, setQueue] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [sheetStatus, setSheetStatus] = useState({
    status: "disconnected",
    sheet_url: "",
    synced_rows: 0,
    last_synced_at: null,
  });

  const loadAll = useCallback(async () => {
    try {
      const [
        leadsData,
        statsData,
        scoringData,
        activityData,
        agentsData,
        callStatsData,
        queueData,
        campaignsData,
        templatesData,
        sheetData,
      ] = await Promise.all([
        getLeads(),
        getLeadStats(),
        getLeadScoring(),
        getLeadActivity(),
        getAgents(),
        getCallStats(),
        getQueue(),
        getCampaigns(),
        getTemplates(),
        getSheetStatus(),
      ]);

      setLeads(leadsData);
      setStats(statsData);
      setScoring(scoringData);
      setActivity(activityData);
      setAgents(agentsData);
      setCallStats(callStatsData);
      setQueue(queueData);
      setCampaigns(campaignsData);
      setTemplates(templatesData);
      setSheetStatus(sheetData);
    } catch (error) {
      console.error("Failed to load leads dashboard", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#EEF6FF" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar />

        <div style={{ flex: 1, overflowY: "auto", padding: "30px" }}>
          <LeadsHeader
            search={search}
            onSearchChange={setSearch}
            onAddLead={() => setShowAddLead(true)}
          />

          <LeadsStatCards stats={stats} />

          <LeadsTabs active={activeTab} onChange={setActiveTab} />

          {loading ? (
            <p style={{ color: "#64748B" }}>Loading leads...</p>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab leads={leads} activity={activity} />
              )}

              {activeTab === "all-leads" && (
                <AllLeadsTab leads={leads} search={search} onChanged={loadAll} />
              )}

              {activeTab === "whatsapp" && (
                <WhatsAppAutomationTab templates={templates} onChanged={loadAll} />
              )}

              {activeTab === "calling-agents" && (
                <AiCallingAgentsTab
                  agents={agents}
                  callStats={callStats}
                  queue={queue}
                  onChanged={loadAll}
                />
              )}

              {activeTab === "google-sheets" && (
                <GoogleSheetsTab status={sheetStatus} onChanged={loadAll} />
              )}

              {activeTab === "scoring" && <LeadScoringTab scoring={scoring} />}

              {activeTab === "campaigns" && (
                <CampaignsTab campaigns={campaigns} onChanged={loadAll} />
              )}

              {activeTab === "activity" && <ActivityTab activity={activity} />}
            </>
          )}
        </div>
      </div>

      {showAddLead && (
        <AddLeadModal onClose={() => setShowAddLead(false)} onCreated={loadAll} />
      )}
    </div>
  );
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeadStage = "new" | "qualified" | "negotiation" | "closed";
export type AgentState = "active" | "standby" | "paused";
export type DealStage = "Under Contract" | "Due Diligence" | "Financing" | "Closed";

export interface Lead {
  id: string;
  name: string;
  stage: LeadStage;
  score: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: "running" | "paused";
  sent: number;
  replies: number;
}

export interface Agent {
  id: string;
  name: string;
  state: AgentState;
  tasksRun: number;
}

export interface Deal {
  id: string;
  name: string;
  stage: DealStage;
  eta: string;
}

interface OSState {
  leads: Lead[];
  campaigns: Campaign[];
  agents: Agent[];
  deals: Deal[];
  activityLog: string[];
  workflowSteps: { id: string; title: string; done: boolean }[];
  moveLead: (leadId: string, direction: "forward" | "backward") => void;
  toggleCampaign: (campaignId: string) => void;
  runCampaignCycle: (campaignId: string) => void;
  setAgentState: (agentId: string, state: AgentState) => void;
  runAgentTask: (agentId: string) => void;
  setDealStage: (dealId: string, stage: DealStage) => void;
  toggleWorkflowStep: (stepId: string) => void;
  setWorkflowStepDone: (stepId: string, done: boolean) => void;
  addWorkflowStep: (title: string) => void;
  removeWorkflowStep: (stepId: string) => void;
  clearWorkflowSteps: () => void;
  resetWorkflowProgress: () => void;
  runWorkflow: () => void;
  resetWorkflowDefaults: () => void;
  addActivity: (message: string) => void;
}

const STAGE_ORDER: LeadStage[] = ["new", "qualified", "negotiation", "closed"];

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      leads: [
        { id: "l1", name: "Owner of 212 Lake Ave", stage: "new", score: 78 },
        { id: "l2", name: "Buyer - Austin duplex search", stage: "new", score: 73 },
        { id: "l3", name: "Institutional buyer - Charlotte 8-unit", stage: "qualified", score: 91 },
        { id: "l4", name: "Seller ready in 30 days", stage: "qualified", score: 80 },
        { id: "l5", name: "Offer on prop-018", stage: "negotiation", score: 86 },
      ],
      campaigns: [
        { id: "c1", name: "Off-market multifamily owners · Austin", status: "running", sent: 124, replies: 22 },
        { id: "c2", name: "Absentee landlord sequence · Charlotte", status: "running", sent: 91, replies: 17 },
        { id: "c3", name: "Seller winback journey · Denver", status: "paused", sent: 54, replies: 8 },
      ],
      agents: [
        { id: "a1", name: "Lead Qualification Agent", state: "active", tasksRun: 112 },
        { id: "a2", name: "Market Research Agent", state: "active", tasksRun: 74 },
        { id: "a3", name: "Deal Analysis Agent", state: "active", tasksRun: 59 },
        { id: "a4", name: "Negotiation Agent", state: "standby", tasksRun: 21 },
        { id: "a5", name: "CRM Memory Agent", state: "active", tasksRun: 130 },
      ],
      deals: [
        { id: "d1", name: "prop-018", stage: "Under Contract", eta: "7 days" },
        { id: "d2", name: "prop-033", stage: "Due Diligence", eta: "13 days" },
        { id: "d3", name: "prop-041", stage: "Financing", eta: "21 days" },
        { id: "d4", name: "prop-057", stage: "Closed", eta: "Completed" },
      ],
      activityLog: [
        "Lead Qualification Agent scored 12 inbound leads",
        "Deal Analysis Agent flagged 3 undervalued multifamily assets",
        "Negotiation Agent prepared revised offer strategy",
        "CRM Memory Agent linked prior owner conversation context",
      ],
      workflowSteps: [
        { id: "w1", title: "Lead Qualification Agent", done: true },
        { id: "w2", title: "Market Research Agent", done: false },
        { id: "w3", title: "Deal Analysis Agent", done: false },
        { id: "w4", title: "Outreach Agent", done: false },
      ],
      moveLead: (leadId, direction) =>
        set((state) => ({
          leads: state.leads.map((lead) => {
            if (lead.id !== leadId) return lead;
            const index = STAGE_ORDER.indexOf(lead.stage);
            const next =
              direction === "forward"
                ? Math.min(index + 1, STAGE_ORDER.length - 1)
                : Math.max(index - 1, 0);
            return { ...lead, stage: STAGE_ORDER[next] };
          }),
        })),
      toggleCampaign: (campaignId) =>
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === campaignId
              ? { ...campaign, status: campaign.status === "running" ? "paused" : "running" }
              : campaign
          ),
        })),
      runCampaignCycle: (campaignId) =>
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === campaignId
              ? {
                  ...campaign,
                  sent: campaign.sent + 8,
                  replies: campaign.replies + Math.floor(Math.random() * 3),
                }
              : campaign
          ),
          activityLog: [
            `Outreach Agent ran cycle for ${state.campaigns.find((c) => c.id === campaignId)?.name ?? "campaign"}`,
            ...state.activityLog,
          ].slice(0, 40),
        })),
      setAgentState: (agentId, nextState) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === agentId ? { ...agent, state: nextState } : agent
          ),
        })),
      runAgentTask: (agentId) =>
        set((state) => {
          const agent = state.agents.find((a) => a.id === agentId);
          return {
            agents: state.agents.map((a) =>
              a.id === agentId ? { ...a, tasksRun: a.tasksRun + 1 } : a
            ),
            activityLog: [
              `${agent?.name ?? "Agent"} completed a new autonomous task`,
              ...state.activityLog,
            ].slice(0, 40),
          };
        }),
      setDealStage: (dealId, stage) =>
        set((state) => ({
          deals: state.deals.map((deal) => (deal.id === dealId ? { ...deal, stage } : deal)),
        })),
      toggleWorkflowStep: (stepId) =>
        set((state) => ({
          workflowSteps: state.workflowSteps.map((step) =>
            step.id === stepId ? { ...step, done: !step.done } : step
          ),
        })),
      setWorkflowStepDone: (stepId, done) =>
        set((state) => ({
          workflowSteps: state.workflowSteps.map((step) =>
            step.id === stepId ? { ...step, done } : step
          ),
        })),
      addWorkflowStep: (title) =>
        set((state) => {
          const clean = title.trim();
          if (!clean) return state;
          return {
            workflowSteps: [
              ...state.workflowSteps,
              { id: `w-${Date.now()}`, title: clean, done: false },
            ],
          };
        }),
      removeWorkflowStep: (stepId) =>
        set((state) => ({
          workflowSteps: state.workflowSteps.filter((step) => step.id !== stepId),
        })),
      clearWorkflowSteps: () => set({ workflowSteps: [] }),
      resetWorkflowProgress: () =>
        set((state) => ({
          workflowSteps: state.workflowSteps.map((step) => ({ ...step, done: false })),
        })),
      runWorkflow: () => {
        const next = get().workflowSteps.map((step) => ({ ...step, done: true }));
        set((state) => ({
          workflowSteps: next,
          activityLog: ["Workflow Builder executed autonomous chain", ...state.activityLog].slice(
            0,
            40
          ),
        }));
      },
      resetWorkflowDefaults: () =>
        set(() => ({
          workflowSteps: [
            { id: "w1", title: "Lead Qualification Agent", done: true },
            { id: "w2", title: "Market Research Agent", done: false },
            { id: "w3", title: "Deal Analysis Agent", done: false },
            { id: "w4", title: "Outreach Agent", done: false },
          ],
        })),
      addActivity: (message) =>
        set((state) => ({
          activityLog: [message, ...state.activityLog].slice(0, 40),
        })),
    }),
    { name: "estate-ai-os-store" }
  )
);

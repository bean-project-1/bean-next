// =======================================================
// BEAN — Dashboard Page
// apps/web/app/dashboard/page.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { LifeScore } from '@bean/ui';
import { RadarChart } from '@bean/ui';
import { ProgressBar } from '@bean/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@bean/ui';
import type { DimensionScore, Insight } from '@bean/types';

// ---- Mock data (replace with real API calls) ----

const MOCK_SCORES: DimensionScore[] = [
  { key: 'values', label: 'Values', value: 7.5, trend: 'stable' },
  { key: 'interests', label: 'Interests', value: 8.0, trend: 'up' },
  { key: 'motivations', label: 'Motivations', value: 6.5, trend: 'stable' },
  { key: 'knowledge', label: 'Knowledge', value: 7.0, trend: 'up' },
  { key: 'skills', label: 'Skills', value: 7.5, trend: 'up' },
  { key: 'career', label: 'Career', value: 6.0, trend: 'stable' },
  { key: 'income', label: 'Income', value: 5.5, trend: 'stable' },
  { key: 'health', label: 'Health', value: 7.0, trend: 'up' },
  { key: 'relationships', label: 'Relationships', value: 7.5, trend: 'stable' },
  { key: 'happiness', label: 'Happiness', value: 6.5, trend: 'up' },
];

const MOCK_INSIGHTS: Insight[] = [
  {
    id: '1',
    userId: 'demo',
    category: 'strength',
    title: 'Strong intellectual foundation',
    body: 'Your knowledge and skills are tracking above average. Double down on them.',
    affectedDimensions: ['knowledge', 'skills'],
    priority: 'medium',
    actionable: true,
    suggestedAction: 'Identify 2–3 high-leverage projects that use your top skills.',
    generatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'demo',
    category: 'gap',
    title: 'Income potential not fully realized',
    body: 'Your income lags your skills. Consider negotiating or exploring new opportunities.',
    affectedDimensions: ['income', 'career'],
    priority: 'high',
    actionable: true,
    suggestedAction: 'Research market rates and prepare a compensation conversation.',
    generatedAt: new Date(),
  },
  {
    id: '3',
    userId: 'demo',
    category: 'opportunity',
    title: 'Wellbeing is a growth catalyst',
    body: 'Investing in health and relationships compounds positively on all dimensions.',
    affectedDimensions: ['health', 'relationships'],
    priority: 'medium',
    actionable: true,
    suggestedAction: 'Schedule consistent exercise and one meaningful social interaction per week.',
    generatedAt: new Date(),
  },
];

const LIFE_SCORE = 70;

const PILLAR_GROUPS = [
  {
    key: 'identity',
    label: '🧭 Identity',
    keys: ['values', 'interests', 'motivations'],
  },
  {
    key: 'capital',
    label: '💼 Capital',
    keys: ['knowledge', 'skills', 'career', 'income'],
  },
  {
    key: 'wellbeing',
    label: '❤️ Wellbeing',
    keys: ['health', 'relationships', 'happiness'],
  },
];

const categoryColors: Record<string, string> = {
  strength: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  gap: 'border-red-500/30 bg-red-500/10 text-red-400',
  opportunity: 'border-violet-500/30 bg-violet-500/10 text-violet-400',
  risk: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  action: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
};

const priorityDot: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-neutral-500',
};

function TrendBadge({ trend }: { trend?: 'up' | 'down' | 'stable' }) {
  if (!trend) return null;
  return (
    <span
      className={`text-xs ${
        trend === 'up'
          ? 'text-emerald-400'
          : trend === 'down'
            ? 'text-red-400'
            : 'text-neutral-500'
      }`}
    >
      {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
    </span>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'dimensions' | 'insights'>('overview');

  const radarData = MOCK_SCORES.map((s) => ({ label: s.label, value: s.value }));

  return (
    <main className="min-h-screen">
      {/* ---- Header ---- */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Dashboard</h1>
              <p className="text-xs text-neutral-500">March 2026</p>
            </div>
          </div>
          <a
            href="/profile"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-neutral-400 transition hover:text-white"
          >
            My Profile →
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ---- Tabs ---- */}
        <div className="mb-8 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 sm:w-fit">
          {(['overview', 'dimensions', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ======== OVERVIEW TAB ======== */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Life Score */}
            <Card className="flex flex-col items-center justify-center py-8">
              <LifeScore score={LIFE_SCORE} size="lg" />
              <p className="mt-6 text-center text-sm text-neutral-500">
                Updated today · 3 dimensions improved
              </p>
            </Card>

            {/* Radar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Life Dimensions Radar</CardTitle>
                <span className="text-sm text-neutral-500">All 10 dimensions</span>
              </CardHeader>
              <CardContent className="flex justify-center">
                <RadarChart data={radarData} size={280} showLabels />
              </CardContent>
            </Card>

            {/* Top Insight */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Insight</CardTitle>
              </CardHeader>
              <CardContent>
                {MOCK_INSIGHTS[0] && (
                  <div
                    className={`rounded-xl border p-4 ${categoryColors[MOCK_INSIGHTS[0].category]}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {MOCK_INSIGHTS[0].category}
                      </span>
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${priorityDot[MOCK_INSIGHTS[0].priority]}`}
                      />
                      <span className="text-xs capitalize text-current opacity-70">
                        {MOCK_INSIGHTS[0].priority} priority
                      </span>
                    </div>
                    <h3 className="mb-1 font-semibold text-white">{MOCK_INSIGHTS[0].title}</h3>
                    <p className="text-sm text-neutral-400">{MOCK_INSIGHTS[0].body}</p>
                    {MOCK_INSIGHTS[0].suggestedAction && (
                      <p className="mt-3 text-sm font-medium text-white/80">
                        → {MOCK_INSIGHTS[0].suggestedAction}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======== DIMENSIONS TAB ======== */}
        {activeTab === 'dimensions' && (
          <div className="grid gap-6 lg:grid-cols-3">
            {PILLAR_GROUPS.map((pillar) => {
              const scores = MOCK_SCORES.filter((s) => pillar.keys.includes(s.key));
              const avg = scores.reduce((sum, s) => sum + s.value, 0) / scores.length;
              return (
                <Card key={pillar.key}>
                  <CardHeader>
                    <CardTitle>{pillar.label}</CardTitle>
                    <span className="text-sm font-semibold text-violet-400">
                      {avg.toFixed(1)}/10
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scores.map((s) => (
                        <div key={s.key}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm text-neutral-300">{s.label}</span>
                            <div className="flex items-center gap-1">
                              <TrendBadge trend={s.trend} />
                              <span className="text-sm font-medium text-white">{s.value}</span>
                            </div>
                          </div>
                          <ProgressBar value={s.value} max={10} showLabel={false} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ======== INSIGHTS TAB ======== */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {MOCK_INSIGHTS.map((insight) => (
              <Card key={insight.id} hoverable>
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg border px-2 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[insight.category]}`}
                  >
                    {insight.category}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-semibold text-white">{insight.title}</h3>
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${priorityDot[insight.priority]}`}
                        title={`${insight.priority} priority`}
                      />
                    </div>
                    <p className="mb-3 text-sm text-neutral-400">{insight.body}</p>
                    {insight.suggestedAction && (
                      <div className="rounded-lg border border-white/5 bg-white/3 px-3 py-2 text-sm text-neutral-300">
                        <span className="font-medium text-violet-400">Action: </span>
                        {insight.suggestedAction}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {insight.affectedDimensions.map((d) => (
                        <span
                          key={d}
                          className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-neutral-500"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

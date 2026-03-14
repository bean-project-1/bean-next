// =======================================================
// BEAN — Profile Page
// apps/web/app/profile/page.tsx
// =======================================================
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@bean/ui';
import { ProgressBar } from '@bean/ui';

const MOCK_PROFILE = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  profession: 'Software Engineer',
  joinedAt: 'March 2026',
  identity: {
    values: ['Growth', 'Authenticity', 'Impact'],
    interests: ['Technology', 'Travel', 'Reading'],
    motivations: ['Making a difference', 'Continuous learning'],
  },
  capital: {
    skills: ['JavaScript', 'Python', 'System Design'],
    knowledge: ['Web Development', 'AI/ML basics'],
    careerStage: 'Senior Engineer',
    incomeRange: '$120k–$150k',
  },
  wellbeing: {
    exerciseFrequency: '3–4x/week',
    healthScore: 7.0,
    relationshipsScore: 7.5,
    happinessScore: 6.5,
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="text-sm font-bold text-white">B</span>
            </div>
            <span className="text-sm font-semibold text-white">My Profile</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-sm text-neutral-400 hover:text-white transition">
              ← Dashboard
            </a>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl border border-violet-500/30 bg-violet-600/20 px-4 py-1.5 text-sm text-violet-300 transition hover:bg-violet-600/30"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Identity Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white">
                {MOCK_PROFILE.name[0]}
              </div>
              <div>
                <CardTitle>{MOCK_PROFILE.name}</CardTitle>
                <p className="text-sm text-neutral-400">{MOCK_PROFILE.profession}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-600">Member since {MOCK_PROFILE.joinedAt}</p>
          </CardHeader>
        </Card>

        {/* Three columns */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Identity Pillar */}
          <Card>
            <CardHeader>
              <CardTitle>🧭 Identity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Values
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_PROFILE.identity.values.map((v) => (
                      <span
                        key={v}
                        className="rounded-full bg-violet-600/15 px-2.5 py-0.5 text-xs text-violet-300"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_PROFILE.identity.interests.map((i) => (
                      <span
                        key={i}
                        className="rounded-full bg-indigo-600/15 px-2.5 py-0.5 text-xs text-indigo-300"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Motivations
                  </p>
                  <ul className="space-y-1">
                    {MOCK_PROFILE.identity.motivations.map((m) => (
                      <li key={m} className="text-sm text-neutral-400">
                        · {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capital Pillar */}
          <Card>
            <CardHeader>
              <CardTitle>💼 Capital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Career Stage
                  </p>
                  <p className="text-sm text-white">{MOCK_PROFILE.capital.careerStage}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Income Range
                  </p>
                  <p className="text-sm text-white">{MOCK_PROFILE.capital.incomeRange}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Top Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MOCK_PROFILE.capital.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs text-emerald-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wellbeing Pillar */}
          <Card>
            <CardHeader>
              <CardTitle>❤️ Wellbeing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Exercise
                  </p>
                  <p className="text-sm text-white">{MOCK_PROFILE.wellbeing.exerciseFrequency}</p>
                </div>
                <ProgressBar
                  value={MOCK_PROFILE.wellbeing.healthScore}
                  label="Health"
                  max={10}
                />
                <ProgressBar
                  value={MOCK_PROFILE.wellbeing.relationshipsScore}
                  label="Relationships"
                  max={10}
                />
                <ProgressBar
                  value={MOCK_PROFILE.wellbeing.happinessScore}
                  label="Happiness"
                  max={10}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

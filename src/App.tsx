/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileAuditView } from './components/ProfileAuditView';
import { ReadmeBuilder } from './components/ReadmeBuilder';
import { RepoHygieneView } from './components/RepoHygieneView';
import { BioStudio } from './components/BioStudio';
import { BeforeAfterView } from './components/BeforeAfterView';
import { TransformationRoadmap } from './components/TransformationRoadmap';
import { 
  INITIAL_AUDIT_CATEGORIES, 
  INITIAL_USER_PROFILE 
} from './data/profileAuditData';
import { ProfileData, AuditCategory } from './types';
import { 
  fetchLiveGitHubAnalysis, 
  convertLiveAnalysisToProfile, 
  generateAuditCategoriesFromAnalysis, 
  LiveProfileAnalysis 
} from './services/githubService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('audit');
  const [currentUsername, setCurrentUsername] = useState<string>('torvalds');
  const [profileData, setProfileData] = useState<ProfileData>(INITIAL_USER_PROFILE);
  const [categories, setCategories] = useState<AuditCategory[]>(INITIAL_AUDIT_CATEGORIES);
  const [liveAnalysis, setLiveAnalysis] = useState<LiveProfileAnalysis | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const [userError, setUserError] = useState<string | null>(null);

  // Dynamic user loader
  const handleLoadUser = async (username: string) => {
    const cleanUser = username.trim().replace(/^@/, '');
    if (!cleanUser) return;

    setIsLoadingUser(true);
    setUserError(null);

    try {
      const data = await fetchLiveGitHubAnalysis(cleanUser);
      setLiveAnalysis(data);
      setCurrentUsername(data.profile.login);

      // Persist in localStorage and update URL query params so anyone can share or reload
      try {
        localStorage.setItem('gh_audit_username', data.profile.login);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('user', data.profile.login);
        window.history.replaceState({}, '', newUrl.toString());
      } catch (e) {
        // Ignore iframe storage restrictions
      }

      // Auto-generate profile data model and audit categories
      const dynamicProfile = convertLiveAnalysisToProfile(data, profileData);
      const dynamicCategories = generateAuditCategoriesFromAnalysis(data);

      setProfileData(dynamicProfile);
      setCategories(dynamicCategories);
    } catch (err: any) {
      console.error('Failed to load user', err);
      setUserError(err.message || `Could not load GitHub profile for @${cleanUser}`);
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Initial fetch on mount: Check URL parameter first, then localStorage, or fallback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userFromUrl = urlParams.get('user') || urlParams.get('u') || urlParams.get('username');
    const storedUser = localStorage.getItem('gh_audit_username');

    const initialUser = userFromUrl || storedUser || 'torvalds';
    handleLoadUser(initialUser);
  }, []);

  // Toggle issue fixed status & calculate dynamic score
  const handleToggleIssue = (categoryId: string, issueId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const updatedIssues = cat.issues.map((iss) =>
          iss.id === issueId ? { ...iss, fixed: !iss.fixed } : iss
        );
        const fixedCount = updatedIssues.filter((i) => i.fixed).length;
        const total = updatedIssues.length;
        const newScore = Math.round((fixedCount / total) * 100);
        return {
          ...cat,
          issues: updatedIssues,
          score: newScore,
          status: newScore === 100 ? 'good' : newScore > 50 ? 'warning' : 'critical',
        };
      })
    );
  };

  // Calculate weighted overall score
  const overallScore = useMemo(() => {
    let totalWeight = 0;
    let weightedSum = 0;
    categories.forEach((cat) => {
      totalWeight += cat.weight;
      weightedSum += cat.score * cat.weight;
    });
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }, [categories]);

  // Count active critical issues
  const criticalIssueCount = useMemo(() => {
    let count = 0;
    categories.forEach((c) => {
      c.issues.forEach((i) => {
        if (!i.fixed && i.severity === 'critical') count++;
      });
    });
    return count;
  }, [categories]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col selection:bg-[#238636] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overallScore={overallScore}
        criticalIssueCount={criticalIssueCount}
        currentUsername={currentUsername}
        profileData={profileData}
        isLoadingUser={isLoadingUser}
        onSearchUser={handleLoadUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'audit' && (
          <ProfileAuditView
            categories={categories}
            onToggleIssue={handleToggleIssue}
            onNavigateTab={setActiveTab}
            overallScore={overallScore}
            currentUsername={currentUsername}
            liveData={liveAnalysis}
            isLoading={isLoadingUser}
            liveError={userError}
            onSearchUser={handleLoadUser}
          />
        )}

        {activeTab === 'readme' && (
          <ReadmeBuilder
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}

        {activeTab === 'hygiene' && (
          <RepoHygieneView
            currentUsername={currentUsername}
            liveRepos={liveAnalysis?.repos}
          />
        )}

        {activeTab === 'bio' && (
          <BioStudio
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}

        {activeTab === 'comparison' && (
          <BeforeAfterView
            profileData={profileData}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'roadmap' && (
          <TransformationRoadmap onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] py-6 bg-[#161b22]/50 text-center text-xs text-[#8b949e]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} GitHub Profile Polish & README Architect • Built for Developers</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('audit')} className="hover:text-white transition-colors">
              Profile Audit
            </button>
            <button onClick={() => setActiveTab('readme')} className="hover:text-white transition-colors">
              README Builder
            </button>
            <button onClick={() => setActiveTab('roadmap')} className="hover:text-white transition-colors">
              7-Day Playbook
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

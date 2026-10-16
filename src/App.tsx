/**
 * Little Stars — عالم الصغار
 * Production-oriented preschool educational web platform (Ages 2-6)
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { BrowseActivitiesPage } from './pages/BrowseActivitiesPage';
import { EducationalAppsPage } from './pages/EducationalAppsPage';
import { ActivityDetailPage } from './pages/ActivityDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ParentCornerPage } from './pages/ParentCornerPage';
import { PrintablesPage } from './pages/PrintablesPage';
import { EducationalActivitiesHubPage } from './pages/EducationalActivitiesHubPage';
import { AboutPage, PrivacyPage, TermsPage, ContactReportPage } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPortal } from './pages/admin/AdminPortal';
import {
  getResources,
  getCategories,
  getFavoriteIds,
  toggleFavorite,
  getRecentlyPlayedIds,
  recordRecentlyPlayed,
} from './lib/storage';
import { EducationalResource, Category } from './types/database';
import { sounds } from './lib/audio';
import { getAdminAuthStatus, subscribeToAdminAuth } from './lib/adminAuth';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load initial data and admin authorization status
  useEffect(() => {
    async function init() {
      try {
        const [res, cats] = await Promise.all([getResources(), getCategories()]);
        setResources(res);
        setCategories(cats);
        setFavorites(getFavoriteIds());
        setRecentlyPlayed(getRecentlyPlayedIds());
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();

    // Verify admin authority strictly from database RPC is_admin()
    getAdminAuthStatus().then((status) => {
      setIsAdmin(status.isAdmin);
    });

    const unsubscribe = subscribeToAdminAuth((status) => {
      setIsAdmin(status.isAdmin);
    });

    // Handle deep-link /admin/login or #admin path
    const handleLocationCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/admin' ||
        path === '/admin/login' ||
        path === '/admin/dashboard' ||
        hash === '#admin' ||
        hash === '#admin/login' ||
        hash === '#admin-portal'
      ) {
        setCurrentView('admin');
      }
    };
    handleLocationCheck();
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  const handleReloadResources = async () => {
    try {
      const res = await getResources();
      setResources(res);
    } catch (err) {
      console.error('Failed to reload resources:', err);
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    setFavorites(getFavoriteIds());
  };

  const handleSelectResource = (resource: EducationalResource) => {
    sounds.playPop();
    recordRecentlyPlayed(resource.id);
    setRecentlyPlayed(getRecentlyPlayedIds());
    setSelectedResource(resource);
    setCurrentView('activity_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [hubInitialSlug, setHubInitialSlug] = useState<string | null>(null);

  const handleSelectCategoryFromHome = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, param?: string) => {
    sounds.playPop();

    if (view === 'learning_plan') {
      if (currentView !== 'home') {
        setCurrentView('home');
        setTimeout(() => {
          document.getElementById('learning-plan')?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        document.getElementById('learning-plan')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (view === 'browse') {
      if (param) {
        setSelectedCategoryId(param);
      }
      setCurrentView('browse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'activities_hub') {
      setHubInitialSlug(param || null);
      setCurrentView('activities_hub');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPortal = () => {
    // Navigate to admin portal
    sounds.playPop();
    try {
      window.history.pushState(null, '', '/admin/login');
    } catch {}
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50/50">
        <div className="w-16 h-16 rounded-full border-4 border-amber-300 border-t-amber-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-amber-900">مرحباً بكم في عالم الصغار ⭐</h2>
        <p className="text-xs text-slate-500 mt-1">جاري تجهيز الألعاب والأنشطة المبهجة...</p>
      </div>
    );
  }

  // Admin Portal has its own dashboard layout
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <AdminPortal
            onExit={() => {
              try {
                if (window.location.pathname.startsWith('/admin')) {
                  window.history.pushState(null, '', '/');
                }
              } catch {}
              setCurrentView('home');
            }}
            onAdminAuthChange={(status) => setIsAdmin(status)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/20 text-slate-800">
      {/* Top Bar Contract Navbar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        favoritesCount={favorites.length}
        isAdmin={isAdmin}
        onOpenParentGateForAdmin={handleOpenAdminPortal}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentView === 'home' && (
          <HomePage
            categories={categories}
            resources={resources}
            favorites={favorites}
            recentlyPlayed={recentlyPlayed}
            onToggleFavorite={handleToggleFavorite}
            onSelectResource={handleSelectResource}
            onSelectCategory={handleSelectCategoryFromHome}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'browse' && (
          <BrowseActivitiesPage
            categories={categories}
            resources={resources}
            favorites={favorites}
            initialCategoryId={selectedCategoryId}
            onToggleFavorite={handleToggleFavorite}
            onSelectResource={handleSelectResource}
          />
        )}

        {currentView === 'apps' && (
          <EducationalAppsPage
            categories={categories}
            resources={resources}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectResource={handleSelectResource}
            onReloadResources={handleReloadResources}
          />
        )}

        {currentView === 'activity_detail' && (
          selectedResource ? (
            <ActivityDetailPage
              resource={selectedResource}
              isFavorite={favorites.includes(selectedResource.id)}
              allResources={resources}
              onToggleFavorite={handleToggleFavorite}
              onBack={() => setCurrentView('browse')}
              onSelectResource={handleSelectResource}
            />
          ) : (
            <BrowseActivitiesPage
              categories={categories}
              resources={resources}
              favorites={favorites}
              initialCategoryId={selectedCategoryId}
              onToggleFavorite={handleToggleFavorite}
              onSelectResource={handleSelectResource}
            />
          )
        )}

        {currentView === 'favorites' && (
          <FavoritesPage
            resources={resources}
            favorites={favorites}
            recentlyPlayed={recentlyPlayed}
            onToggleFavorite={handleToggleFavorite}
            onSelectResource={handleSelectResource}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'parents' && <ParentCornerPage onNavigate={handleNavigate} />}

        {currentView === 'activities_hub' && (
          <EducationalActivitiesHubPage
            initialCategorySlug={hubInitialSlug}
            onNavigateToPrintables={() => handleNavigate('printables')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'printables' && <PrintablesPage />}

        {currentView === 'about' && <AboutPage onBack={() => handleNavigate('home')} />}

        {currentView === 'privacy' && <PrivacyPage onBack={() => handleNavigate('home')} />}

        {currentView === 'terms' && <TermsPage onBack={() => handleNavigate('home')} />}

        {currentView === 'report' && <ContactReportPage onBack={() => handleNavigate('home')} />}

        {currentView === 'not_found' && <NotFoundPage onHome={() => handleNavigate('home')} />}
      </main>

      {/* Child Privacy Compliant Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

import './index.css'
import App from './App.tsx'
import AdminLayout from './admin/AdminLayout.tsx'
import Dashboard from './admin/Dashboard.tsx'
import ProjectsPage from './admin/ProjectsPage.tsx'
import PostsPage from './admin/PostsPage.tsx'
import SkillsPage from './admin/SkillsPage.tsx'
import AchievementsPage from './admin/AchievementsPage.tsx'
import ExperiencePage from './admin/ExperiencePage.tsx'
import SocialLinksPage from './admin/SocialLinksPage.tsx'
import TagsPage from './admin/TagsPage.tsx'
import NavigationPage from './admin/NavigationPage.tsx'
import MessagesPage from './admin/MessagesPage.tsx'
import ReleasesPage from './admin/ReleasesPage.tsx'
import AnalyticsPage from './admin/AnalyticsPage.tsx'
import SettingsPage from './admin/SettingsPage.tsx'
import MediaPage from './admin/MediaPage.tsx'
import LoginPage from './admin/LoginPage.tsx'

import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="releases" element={<ReleasesPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="social-links" element={<SocialLinksPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="navigation" element={<NavigationPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);

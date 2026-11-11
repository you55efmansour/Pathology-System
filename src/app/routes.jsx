/* eslint-disable react-refresh/only-export-components -- This module exports route configuration. */
import { createBrowserRouter, createHashRouter, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import CaseListPage from '@/features/cases/pages/CaseListPage';
import CaseWorkspace from '@/features/cases/pages/CaseWorkspace';
import IntakePage from '@/features/cases/pages/IntakePage';
import SlidesPage from '@/features/cases/pages/SlidesPage';
import ReportEditorPage from '@/features/reports/pages/ReportEditorPage';
import ReviewPage from '@/features/reports/pages/ReviewPage';
import TemplatesPage from '@/features/reports/pages/TemplatesPage';
import WorkspacePage from '@/features/shared/pages/WorkspacePage';
import { WorkspaceState } from '@/features/shared/components/WorkspaceState';

const createRouter = import.meta.env.VITE_GITHUB_PAGES === 'true' ? createHashRouter : createBrowserRouter;

export default createRouter([{ element: <AppLayout />, children: [
  { index: true, element: <Navigate to="/cases" replace /> },
  { path: 'cases', element: <CaseListPage key="cases" /> },
  { path: 'review', element: <CaseListPage key="review" mode="review" /> },
  { path: 'reports', element: <CaseListPage key="finalized" mode="finalized" /> },
  { path: 'cases/new', element: <CaseWorkspace />, children: [{ index: true, element: <IntakePage /> }] },
  { path: 'cases/:caseId', element: <CaseWorkspace />, children: [
    { index: true, element: <Navigate to="intake" replace /> },
    { path: 'intake', element: <IntakePage /> }, { path: 'slides', element: <SlidesPage /> },
    { path: 'report', element: <ReportEditorPage /> }, { path: 'review', element: <ReviewPage /> },
    { path: 'final', element: <ReviewPage finalized /> },
  ] },
  { path: 'templates', element: <TemplatesPage /> }, { path: 'workspace', element: <WorkspacePage /> },
  { path: '*', element: <WorkspaceState title="Page not found" description="Return to the case worklist using the navigation." /> },
] }]);

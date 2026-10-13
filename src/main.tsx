import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ReportsProvider } from './context/ReportsContext';
import { ManageReportsPage } from './pages/ManageReportsPage';
import { NewReportPage } from './pages/NewReportPage';
import { OverviewPage } from './pages/OverviewPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReportsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="reports/new" element={<NewReportPage />} />
            <Route path="reports/:id" element={<ReportDetailPage />} />
            <Route path="admin" element={<ManageReportsPage />} />
            <Route path="*" element={<ReportDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReportsProvider>
  </React.StrictMode>,
);

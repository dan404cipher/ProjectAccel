import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';
import CreateProject from 'Project/CreateProject';

const AppRoutes = () => {
  console.log('Routes component rendering'); // Debug log

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/project" replace />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/project/create" element={<CreateProject />} />
        <Route 
          path="/project/:projectId/board" 
          element={<Project />}
        />
        <Route path="/project/:projectId/settings" element={<Project />} />
        <Route path="/project/:projectId/sprints" element={<Project />} />
        <Route path="/project/:projectId/summary" element={<Project />} />
        <Route path="/project/:projectId" element={<Project />} />
        <Route path="/project" element={<Project />} />
        <Route path="*" element={<PageError />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

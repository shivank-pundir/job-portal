import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ApplyJobs from './pages/ApplyJobs';
import Applications from './pages/Applications';
import RecuiterLogin from './components/RecuiterLogin';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashbord';
import AddJob from './pages/AddJob';
import ViewApplication from './pages/ViewApplication';
import ManageJob from './pages/ManageJob';
import 'quill/dist/quill.snow.css'

const App = () => {
  const { showRecrutierLogin } = useContext(AppContext);

  return (
    <div>
      {showRecrutierLogin && <RecuiterLogin />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJobs />} />
        <Route path="/application" element={<Applications />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="view-application" element={<ViewApplication />} />
          <Route path="manage-job" element={<ManageJob />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

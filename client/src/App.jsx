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
  import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  const { showRecrutierLogin, companyToken} = useContext(AppContext);

  return (
    <div>
  
      {showRecrutierLogin && <RecuiterLogin />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJobs />} />
        <Route path="/application" element={<Applications />} />

{companyToken ? <>
<Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="view-application" element={<ViewApplication />} />
          <Route path="manage-job" element={<ManageJob />} />
        </Route>
</> :
null
}
    
        
      </Routes>
    </div>
  );
};

export default App;

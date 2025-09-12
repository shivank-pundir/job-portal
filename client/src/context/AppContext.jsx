import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();
export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {user} = useUser()
  const {getToken} = useAuth()

  // Search & Jobs
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [job, setJob] = useState([]);

  // UI
  const [showRecrutierLogin, setShowRecrutierLogin] = useState(false);
  const [userData, setUserData] = useState(null)
    const [userDataApplications, setUserDataApplications] = useState([])


  // Company Auth
  const [companyToken, setCompanyToken] = useState(() => {
    // Initialize from localStorage to survive refresh
    return localStorage.getItem("companyToken") || null;
  });

  const [companyData, setCompanyData] = useState(() => {
    const storedData = localStorage.getItem("companyData");
    return storedData ? JSON.parse(storedData) : null;
  });

  // Fetch jobs 
  const fetchJobs = async () => {
  
  try {
    const { data } = await axios.get(`${backendUrl}/api/jobs`);
    console.log("Full response:", data); // 👈 check this first

    if (data.success) {
      setJob(data.jobs || data.job); // handle both cases
      console.log("Jobs:", data.jobs || data.job);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  // Fetch company data using token
  const fetchCompanyData = async (token) => {
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCompanyData(data.company);
        localStorage.setItem("companyData", JSON.stringify(data.company));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch company data");
      // If 401, clear invalid token
      if (error.response?.status === 401) {
        setCompanyToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyToken");
        localStorage.removeItem("companyData");
      }
    }
  };

  //function to fetch user data
const fetchUserData = async () => {
  try {
   const token = await getToken();
console.log( "token "+ token)
const { data } = await axios.get(`${backendUrl}/api/users/user`, {
  headers: { Authorization: `Bearer ${token}` },
});
console.log("User API response:", data);


    if (data.success) {
      setUserData(data.user);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("fetchUserData error:", error);
    toast.error(error.message);
  }
};


  // On first load
  useEffect(() => {
    fetchJobs();

    // If token exists, fetch fresh company data
    if (companyToken && !companyData) {
      fetchCompanyData(companyToken);
    }
  }, []);

  // Whenever token changes, fetch company data if not already fetched
  useEffect(() => {
    if (companyToken && !companyData) {
      fetchCompanyData(companyToken);
    }
  }, [companyToken]);

  // Whenever companyToken updates, persist to localStorage
  useEffect(() => {
    if (companyToken) {
      localStorage.setItem("companyToken", companyToken);
    } else {
      localStorage.removeItem("companyToken");
    }
  }, [companyToken]);

useEffect(() => {
  const loadUserData = async () => {
    if (user) {
      await fetchUserData();
    }
  };
  loadUserData();
}, [user]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    job,
    setJob,
    backendUrl,
    showRecrutierLogin,
    setShowRecrutierLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userData, setUserData,
    userDataApplications, setUserDataApplications
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

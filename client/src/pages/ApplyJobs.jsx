import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import kconvert from 'k-convert'
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'



const ApplyJobs = () => { 
  const { id } = useParams();
  const [jobdata, setJobdata] = useState(null);

  const { job } = useContext(AppContext);

  const fetchdata = () => {
    if (!job) return;
    const data = job.filter(j => j._id === id);
    if (data.length !== 0) {
      setJobdata(data[0]);
      console.log(data[0]);
    }
  }

  useEffect(() => {
    if (job.length > 0) {
      fetchdata();
    }
  }, [job, id]);

  return jobdata ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col container py-10 px-4 2xl:px-20 mx-auto">
        
        <div className="bg-white text-black rounded-full w-full">
          
          {/* Header Section */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 border border-sky-400 bg-sky-100 rounded-xl">
            <div className='flex flex-clo md:flex-row items-center'>
              <img className='h-24 bg-white rounded-lg border border-white p-4 mr-4 max-md:mb-4' src={jobdata.companyId.image} alt="" />
            <div className='text-center md:text-left text-neutral-700'>
              <h1 className='text-2xl sm:text-4xl font-medium'>{jobdata.title}</h1>
              <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                <span className='flex items-center gap-1'>
                  <img src={assets.suitcase_icon} alt="" />
                  {jobdata.companyId.name}
                </span>
                <span className='flex items-center gap-1'>
                  <img src={assets.location_icon} alt="" />
                  {jobdata.location}
                </span>
                <span className='flex items-center gap-1'>
                  <img src={assets.person_icon} alt="" />
                  {jobdata.level}
                </span>
                <span className='flex items-center gap-1'>
                  <img  src={assets.money_icon} alt="" /> 
                  CTC: ${kconvert.convertTo(jobdata.salary)}
                </span>
              </div>
               </div>
            </div>
            <div className='flex-col mt-7 justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
            <button className='border bg-blue-600 px-7 py-2 text-white rounded'>Apply Now</button>
            <p className='text-gray-800 font:sm mt-2'>Posted {moment(jobdata.date).fromNow()}</p>
          </div>
          </div>
<div className='flex flex-col lg:flex-row  justify-between items-start mt-5'>
    <div className='w-full lg:w-2/3 '>
      <h2 className='text-2xl sm:4xl font-bold mb-4 '>Job Description</h2>
      <div className='rich-text' dangerouslySetInnerHTML={{__html:jobdata.description}}></div>
            <button className='border bg-blue-600 px-7 py-2 text-white rounded mt-5'>Apply Now</button>
    </div>

    {/* {Right section for more jobs} */}
  <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5'>
  <h2>More Jobs from {jobdata.companyId.name}</h2>
  {job
    .filter(j => j._id !== jobdata._id && j.companyId._id === jobdata.companyId._id)
    .filter(j => true)
    .slice(0, 4)
    .map((j, idx) => (
      <JobCard key={idx} job={j} />
    ))}
</div>

          </div>
        </div>
      </div>
    <Footer />
    </>
  ) : (
    <div>
      <Loading />
    </div>
  );
}

export default ApplyJobs

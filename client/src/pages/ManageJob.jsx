import React from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const ManageJob = () => {
  const navigate = useNavigate();
  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-h-full border border-gray-200 bg-white max-sm:text-sm w-full'>
          <thead className='border-b border-b-gray-300 bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left max-sm:hidden'>#</th>
              <th className='px-4 py-2 text-left'>Job Title</th>
              <th className='px-4 py-2 text-left max-sm:hidden'>Date</th>
              <th className='px-4 py-2 text-left max-sm:hidden'>Location</th>
              <th className='px-4 py-2 text-center'>Applicants</th>
              <th className='px-4 py-2 text-center'>Visible</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-300'>
            {manageJobsData.map((job, idx) => (
              <tr key={idx} className='text-gray-700'>
                <td className='px-4 py-2 max-sm:hidden'>{idx + 1}</td>
                <td className='px-4 py-2'>{job.title}</td>
                <td className='px-4 py-2 max-sm:hidden'>
                  {moment(job.date).format('ll')}
                </td>
                <td className='px-4 py-2 max-sm:hidden'>{job.location}</td>
                <td className='px-4 py-2 text-center'>{job.applicants}</td>
                <td className='px-4 py-2 text-center'>
                  <input className='scale-125' type='checkbox' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
      <div className='mt-5 flex justify-end'>
        <button onClick={() => navigate('/dashboard/add-job')} className='bg-black text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition'>
          Add New Job
        </button>
      </div>
    </div> 
  )
}

export default ManageJob

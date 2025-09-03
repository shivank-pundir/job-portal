import React from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'

const ViewApplication = () => {
  return (
    <div className='container max-auto p-4'>
      <div className='overflow-x-auto'>
        <table className='w-full max-w-4xl border border-gray-300 max-sm:text-sm'>
          <thead className= 'border-b border-b-gray-300 bg-gray-50'>
            <tr>
              <th className='px-4 py-2 text-left'>#</th>
              <th className='px-4 py-2 text-left'>User name</th>
              <th className='px-4 py-2 text-left max-sm:hidden'>Job Title</th>
              <th className='px-4 py-2 text-left max-sm:hidden'>Location</th>
              <th className='px-4 py-2 text-left'>Resume</th>
              <th className='px-4 py-2 text-left'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-300'>
            {viewApplicationsPageData.map((applicant, idx) => (
              <tr key={idx} className='text-gray-700'>
                <td className='px-4 py-2 text-center'>{idx + 1}</td>
                <td className='px-4 py-2 text-center flex items-center'>
                  <img
                    className='w-10 h-10 rounded-full mr-3 max-sm:hidden'
                    src={applicant.imgSrc}
                    alt=''
                  />
                  <span>{applicant.name}</span>
                </td>
                <td className='px-4 py-2 text-center max-sm:hidden'>
                  {applicant.jobTitle}
                </td>
                <td className='px-4 py-2 text-center max-sm:hidden'>
                  {applicant.location}
                </td>
                <td className='px-4 py-2'>
                  <a
                    href=''
                    target='_blank'
                    className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex items-center gap-2'
                  >
                    Resume
                    <img src={assets.resume_download_icon} alt='' />
                  </a>
                </td>
                <td className='px-4 py-2 relative'>
                  <div className='relative inline text-left group'>
                    <button className='text-gray-500 action-button'>...</button>

                    <div className='absolute z-10 hidden right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                      <button className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>
                        Accept
                      </button>
                      <button className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ViewApplication

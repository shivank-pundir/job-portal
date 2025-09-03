import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill';
import { JobCategories, JobLocations } from '../assets/assets';

const AddJob = () => {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('Bangalor')
  const [category, setCategory] = useState('Programming')
  const [level, setLevel] = useState('Beginner level')
  const [salary, setSalary] = useState(0)
  
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if(!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current, {
        theme:'snow',
      })
    }
  },[])
  return (
    <div>
      <form className='container p-4 w-full flex flex-col items-start gap-3'>
        <div className='w-full'>
        <p className='mb-2'>Job Title</p>
        <input className='w-full max-w-lg px-3 py-1.5 border-2 border-gray-200' onChange={e => setTitle(e.target.value)}
         value={title} type="text" required 
         placeholder='Type here' />
       </div>

<div className='w-full max-w-lg'>
       <p className='my-2'>Description</p>
        <div ref={editorRef}>
          {/* <textarea name="description" id="" rows={4} cols={100} placeholder='Desciption'></textarea> */}
                
        </div>
        </div>
        
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8' >
          <div className='mb-2'>
            <select className=' w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded' onChange={e => setCategory(e.target.value)}>
              {JobCategories.map((category, idx) => (
                   <option key={idx} value="category">{category}</option>
              ))}
             
            </select>
          </div>

          
          <div  className='mb-2'>
            <select className=' w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded' onChange={e => setLocation(e.target.value)}>
              {JobLocations.map((location, idx) => (
                   <option key={idx} value="location">{location}</option>
              )) }
             
            </select>
          </div>

          
          <div  className='mb-2'>
            <select className=' w-full px-4 py-2 border bg-gray-100 border-gray-200 rounded' onChange={e => setCategory(e.target.value)}>
              <option value="Beginner level">Beginner level</option>
                            <option value="Intermediate lavel">Intermediate lavel</option>
                            <option value="Senior lavel">Senior lavel</option>
                            
            </select>
          </div>
         
        </div>
         <div >
            <p className='mb-2'>Salary</p>
            <input className='w-35 px-4 py-2 border border-gray-300 rounded'min={0} type="number" placeholder='25000' />
          </div>
        <button className='borer mt-2 border-white bg-black text-white rounded px-3 py-3 w-28'>Add</button>
      </form>
    </div>
  )
}

export default AddJob

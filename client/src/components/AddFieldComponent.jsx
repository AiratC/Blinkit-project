import React, { useEffect, useRef } from 'react'
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({ setCloseAddField, value, onChange, submit }) => {
   const addFieldRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if(addFieldRef.current && !addFieldRef.current.contains(event.target)) {
            setCloseAddField()
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => { document.removeEventListener("mousedown", handleClickOutside); } 

   }, [addFieldRef])

   return (
      <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 z-50 flex justify-center items-center p-4'>
         <div ref={addFieldRef} className='bg-white rounded p-4 w-full max-w-md'>
            <div className='flex items-center justify-between gap-3'>
               <h1 className='font-semibold'>Добавить поле</h1>
               <button onClick={setCloseAddField}>
                  <IoClose size={25} />
               </button>
            </div>
            <input
               className='bg-blue-50 my-3 p-2 border outline-none focus-within:border-primary-100 rounded w-full '
               placeholder='Введите название поля'
               value={value}
               onChange={onChange}
            />
            <button
               onClick={submit}
               className='bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded mx-auto w-fit block'
            >
               Добавить
            </button>
         </div>
      </section>
   )
}

export default AddFieldComponent
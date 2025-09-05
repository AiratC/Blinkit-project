import React, { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'

const ConfirmBox = ({ cancel, confirm, setCloseConfirmBoxDelete }) => {
   const confirmRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if(confirmRef.current && !confirmRef.current.contains(event.target)) {
            setCloseConfirmBoxDelete()
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }

   }, [confirmRef])

   return (
      <div className='fixed top-0 bottom-0 right-0 left-0 z-50 bg-neutral-800 bg-opacity-70 p-4 flex justify-center items-center'>
         <div ref={confirmRef} className='bg-white w-full max-w-md p-4 rounded'>
            <div className='flex justify-between items-center gap-3'>
               <h1 className='font-semibold'>Удаление категории</h1>
               <button onClick={setCloseConfirmBoxDelete}>
                  <IoClose size={25} />
               </button>
            </div>
            <p className='my-4'>Вы уверены, что хотите удалить навсегда?</p>
            <div className='w-fit ml-auto flex items-center gap-3'>
               <button onClick={cancel} className='px-4 py-1 border rounded border-red-500 text-red-500 hover:bg-red-500 hover:text-white'>Отмена</button>
               <button onClick={confirm} className='px-4 py-1 border rounded border-green-600 text-green-600 hover:bg-green-600 hover:text-white'>Подтвердить</button>
            </div>
         </div>
      </div>
   )
}

export default ConfirmBox
import React, { useEffect, useRef, useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import ConfirmBox from './ConfirmBox'
import { CiEdit } from 'react-icons/ci'
import { AiTwotoneDelete } from 'react-icons/ai'


const ProductCardAdmin = ({ data, fetchProductData }) => {
   const [editOpen, setEditOpen] = useState(false)
   const [openDelete, setOpenDelete] = useState(false)
   const containerDeleteRef = useRef(null);

   const handleDeleteCancel = () => {
      setOpenDelete(false)
   }

   const handleDelete = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.deleteProductDetails,
            data: {
               _id: data._id
            }
         })

         const { data: responseData } = response

         if (responseData.success) {
            toast.success(responseData.message)
            if (fetchProductData) {
               fetchProductData()
            }
            setOpenDelete(false)
         }
      } catch (error) {
         AxiosToastError(error)
      }
   }

   useEffect(() => {
      const handleClickOutside = (event) => {
         if(containerDeleteRef.current && !containerDeleteRef.current.contains(event.target)) {
            setOpenDelete(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => document.removeEventListener("mousedown", handleClickOutside);

   }, [containerDeleteRef]);


   return (
      <div className='w-36 p-4 bg-white rounded'>
         <div>
            <img
               src={data?.image[0]}
               alt={data?.name}
               className='w-full h-full object-scale-down'
            />
         </div>
         <p className='text-ellipsis line-clamp-2 font-medium'>{data?.name}</p>
         <p className='text-slate-400'>{data?.unit}</p>
         <div className='grid grid-cols-2 gap-3 py-2'>
            <button onClick={() => setEditOpen(true)} className='flex items-center justify-center border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded'><CiEdit size={25} /></button>
            <button onClick={() => setOpenDelete(true)} className='flex items-center justify-center border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded'><AiTwotoneDelete size={25} /></button>
         </div>

         {
            editOpen && (
               <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
            )
         }

         {
            openDelete && (
               <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center '>
                  <div ref={containerDeleteRef} className='bg-white p-4 w-full max-w-md rounded-md'>
                     <div className='flex items-center justify-between gap-4'>
                        <h3 className='font-semibold'>Подтверждение удаления продукта</h3>
                        <button onClick={() => setOpenDelete(false)}>
                           <IoClose size={25} />
                        </button>
                     </div>
                     <p className='my-2'>Вы действительно хотите удалить продукт?</p>
                     <div className='flex justify-end gap-5 py-4'>
                        <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200'>Отмена</button>
                        <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200'>Удалить</button>
                     </div>
                  </div>
               </section>
            )
         }
      </div>
   )
}

export default ProductCardAdmin
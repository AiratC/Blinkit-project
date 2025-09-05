import React, { useEffect, useRef, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
// import ViewImage from '../components/ViewImage'
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
// import EditSubCategory from '../components/EditSubCategory'
import toast from 'react-hot-toast'
import ConfirmBox from '../components/ConfirmBox'
import ViewImage from '../components/ViewImage'
import EditSubCategory from '../components/EditSubCategory'

const SubCategoryPage = () => {
   const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const columnHelper = createColumnHelper();
   const [imageURL, setImageURL] = useState("");
   const [openEdit, setOpenEdit] = useState(false);
   const [editData, setEditData] = useState({
      _id: ""
   });
   const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
   const [deleteSubCategory, setDeleteSubCategory] = useState({
      _id: ""
   });



   const fetchSubCategory = async () => {
      try {
         setLoading(true);
         const response = await Axios({
            ...SummaryApi.getSubCategory
         });

         const { data: responseData } = response;

         if (responseData.success) {
            setData(responseData.data);
         };


      } catch (error) {
         console.log(error);
         AxiosToastError(error);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchSubCategory();
   }, []);

   const handleDeleteSubCategory = async (event) => {
      try {
         const response = await Axios({
            ...SummaryApi.deleteSubCategory,
            data: deleteSubCategory
         });

         const { data: responseData } = response;

         if(responseData.success) {
            toast.success(responseData.message);
            fetchSubCategory();
            setOpenDeleteConfirmBox(false);
            setDeleteSubCategory({ _id: "" })
         }

      } catch (error) {
         AxiosToastError(error)
      }
   }

   const column = [
      columnHelper.accessor('name', {
         header: "Название"
      }),
      columnHelper.accessor('image', {
         header: "Изображение",
         cell: ({ row }) => {
            return <div className='flex justify-center items-center'>
               <img
                  src={row.original.image}
                  alt={row.original.name}
                  className='w-8 h-8 cursor-pointer'
                  onClick={() => {
                     setImageURL(row.original.image)
                  }}
               />
            </div>
         }
      }),
      columnHelper.accessor("category", {
         header: "Категория",
         cell: ({ row }) => {
            return (
               <>
                  {
                     row.original.category.map((c, index) => {
                        return (
                           <p key={c._id + "table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                        )
                     })
                  }
               </>
            )
         }
      }),
      columnHelper.accessor("_id", {
         header: "Действие",
         cell: ({ row }) => {
            return (
               <div className='flex items-center justify-center gap-3'>
                  <button onClick={() => {
                     setOpenEdit(true)
                     setEditData(row.original)
                  }} className='p-2 bg-green-100 rounded-full hover:text-green-600'>
                     <HiPencil size={20} />
                  </button>
                  <button onClick={() => {
                     setOpenDeleteConfirmBox(true)
                     setDeleteSubCategory(row.original)
                  }} className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'>
                     <MdDelete size={20} />
                  </button>
               </div>
            )
         }
      })
   ]

   return (
      <section className=''>
         <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Подкатегория</h2>
            <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Добавить подкатегорию</button>
         </div>

         <div className='overflow-auto w-full max-w-[95vw]'>
            <DisplayTable
               data={data}
               column={column}
            />
         </div>

         {
            openAddSubCategory && (
               <UploadSubCategoryModel setCloseAddSubCategory={() => setOpenAddSubCategory(false)} fetchSubCategory={fetchSubCategory} />
            )
         }

         {
            imageURL && (
               <ViewImage url={imageURL} setCloseImageURL={() => setImageURL("")} />
            )
         }

         {
            openEdit && (
               <EditSubCategory setCloseEdit={() => setOpenEdit(false)} data={editData} fetchSubCategory={fetchSubCategory} />
            )
         }

         {
            openDeleteConfirmBox && (
               <ConfirmBox
                  cancel={() => setOpenDeleteConfirmBox(false)}
                  confirm={handleDeleteSubCategory}
                  setCloseConfirmBoxDelete={() => setOpenDeleteConfirmBox(false)}
               />
            )
         }


      </section>
   )
}

export default SubCategoryPage
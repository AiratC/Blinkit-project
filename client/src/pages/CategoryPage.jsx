import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel';
import AxiosToastError from '../utils/AxiosToastError';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { CiEdit } from "react-icons/ci";
import { AiTwotoneDelete } from "react-icons/ai";
import EditCategory from '../components/EditCategory';
import ConfirmBox from '../components/ConfirmBox';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


const CategoryPage = () => {
   const [openUploadCategory, setOpenUploadCategory] = useState(false);
   const [loading, setLoading] = useState(false);
   const [categoryData, setCategoryData] = useState([]);
   const [openEdit, setOpenEdit] = useState(false);
   const [editData, setEditData] = useState({
      name: "",
      image: ""
   });
   const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
   const [deleteCategory, setDeleteCategory] = useState({
      _id: ""
   });

   const allCategory = useSelector((state) => state.product.allCategory);

   useEffect(() => {
      setCategoryData(allCategory)
   }, [allCategory])


   const fetchCategory = async () => {
      try {
         setLoading(true);
         const response = await Axios({
            ...SummaryApi.getCategory
         })

         const { data: responseData } = response;

         if (responseData.success) {
            setCategoryData(responseData.data);
         };

      } catch (error) {
         AxiosToastError(error)
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchCategory()
   }, []);

   const handleDeleteCategory = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.deleteCategory,
            data: deleteCategory
         })

         const { data: responseData } = response;

         if (responseData.success) {
            toast.success(responseData.message);
            fetchCategory();
            setOpenConfirmBoxDelete();
         };


      } catch (error) {
         AxiosToastError(error)
      };
   };

   return (
      <section className=''>
         <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Категории</h2>
            <button onClick={() => setOpenUploadCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Добавить категорию</button>
         </div>

         <div className='p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
            {
               categoryData.map((category, index) => {
                  return (
                     <div key={`category-${index}`} className='w-32 h-56 rounded shadow-md cursor-pointer'>
                        <img
                           src={category.image}
                           alt={category.name}
                           className='w-full object-scale-down'
                        />
                        <div className='flex items-center justify-between h-9'>
                           <button onClick={() => {
                              setOpenEdit(true)
                              setEditData(category)
                           }} className='flex-2 p-1 ml-1 hover:bg-green-200 bg-green-300 text-green-600 font-medium rounded'>
                              <CiEdit size={25} />
                           </button>
                           <button onClick={() => {
                              setOpenConfirmBoxDelete(true);
                              setDeleteCategory(category)
                           }} className='flex-2 p-1 mr-1 hover:bg-red-200 bg-red-300 text-red-600 font-medium rounded'>
                              <AiTwotoneDelete size={25} />
                           </button>
                        </div>
                     </div>
                  )
               })
            }
         </div>

         {
            openUploadCategory && (
               <UploadCategoryModel fetchCategoryData={fetchCategory} closeUploadCategory={() => setOpenUploadCategory(false)} />
            )
         }

         {
            !categoryData[0] && !loading && (
               <NoData />
            )
         }

         {
            openEdit && (
               <EditCategory data={editData} setCloseEdit={() => setOpenEdit(false)} fetchCategoryData={fetchCategory} />
            )
         }

         {
            openConfirmBoxDelete && (
               <ConfirmBox
                  setCloseConfirmBoxDelete={() => setOpenConfirmBoxDelete(false)}
                  cancel={() => setOpenConfirmBoxDelete(false)}
                  confirm={handleDeleteCategory} />
            )
         }
      </section>
   )
}

export default CategoryPage
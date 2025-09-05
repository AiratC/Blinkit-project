import React, { useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from "react-hot-toast";
import AxiosToasError from "./../utils/AxiosToastError"

const UploadCategoryModel = ({ closeUploadCategory, fetchCategoryData }) => {
   const [data, setData] = useState({
      name: "",
      image: ""
   });
   const [loading, setLoading] = useState(false);

   const categoryRef = useRef(null);


   useEffect(() => {
      const handleClickOutside = (event) => {
         if (categoryRef.current && !categoryRef.current.contains(event.target)) {
            closeUploadCategory();
         };
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => document.removeEventListener("mousedown", handleClickOutside);

   }, [categoryRef]);


   const handleOnChange = (event) => {
      const { name, value } = event.target;

      setData((prev) => {
         return {
            ...prev,
            [name]: value
         }
      })
   }

   const handleUploadCategoryImage = async (event) => {
      const file = event.target.files[0];

      if (!file) {
         return
      }

      try {
         setLoading(true);
         const response = await uploadImage(file);
         const { data: ImageResponse } = response;

         setLoading(false);
         setData((prev) => {
            return {
               ...prev,
               image: ImageResponse.data.url
            }
         });


      } catch (error) {
         AxiosToasError(error)
      }

   }


   const handleSubmit = async (event) => {
      event.preventDefault();

      try {
         setLoading(true);
         const response = await Axios({
            ...SummaryApi.addCategory,
            data: data
         });

         const { data: responseData } = response;

         if(responseData.success) {
            toast.success(responseData.message);
            closeUploadCategory();
            fetchCategoryData();
         };

      } catch (error) {
         AxiosToasError(error);
      } finally {
         setLoading(false);
      };
   };




   return (
      <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
         <div ref={categoryRef} className='bg-white max-w-4xl w-full p-4 rounded'>
            <div className='flex items-center justify-between'>
               <h1 className='font-semibold'>Категория</h1>
               <button onClick={closeUploadCategory} className='w-fit block ml-auto'>
                  <IoClose size={25} />
               </button>
            </div>
            <form className='my-3 grid gap-2' onSubmit={handleSubmit}>

               <div className='grid gap-1'>
                  <label id='categoryName'>Название категории</label>
                  <input
                     type='text'
                     id='categoryName'
                     placeholder='Введите название категории'
                     value={data.name}
                     name='name'
                     onChange={handleOnChange}
                     className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
                  />
               </div>

               <div className='grid gap-1'>
                  <p>Изображение</p>
                  <div className='flex gap-4 flex-col lg:flex-row items-center'>
                     <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                        {
                           data.image ? (
                              <img className='w-full h-full object-scale-down' src={data.image} alt="category" />
                           ) : (
                              <p className='text-sm text-neutral-500'>Нет изображения</p>
                           )
                        }
                     </div>
                     <label htmlFor='uploadCategoryImage'>
                        <div className={`
                           ${!data.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"}  
                              px-4 py-2 rounded cursor-pointer border font-medium
                           `}>
                           {
                              loading ? "Loading..." : "Загрузить изображение"
                           }
                           </div>

                        <input disabled={!data.name} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden' />
                     </label>
                  </div>
               </div>

               <button
                  className={`
                  ${data.name && data.image ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300 "}
                  py-2    
                  font-semibold 
                  `}
               >
                  Добавить категорию
               </button>
            </form>
         </div>
      </section>
   )
}

export default UploadCategoryModel
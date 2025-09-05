import React, { useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../utils/AxiosToastError';
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';


const EditCategory = ({ setCloseEdit, fetchCategoryData, data: categoryData }) => {
   const [data, setData] = useState({
      _id: categoryData._id,
      name: categoryData.name,
      image: categoryData.image
   });

   const [loading, setLoading] = useState(false);
   const editCategoryRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (editCategoryRef.current && !editCategoryRef.current.contains(event.target)) {
            setCloseEdit()
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => document.removeEventListener("mousedown", handleClickOutside);

   }, [editCategoryRef]);


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
         return;
      };

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
         AxiosToastError(error)
      }

   }


   const handleSubmit = async (event) => {
      event.preventDefault();

      try {
         setLoading(true);
         const response = await Axios({
            ...SummaryApi.updateCategory,
            data: data
         });

         console.log(`response`, response)

         const { data: responseData } = response;

         console.log(`responseData, `, responseData)
         if (responseData.success) {
            console.log('block if')
            toast.success(responseData.message);
            setCloseEdit();
            fetchCategoryData();
         };

      } catch (error) {
         AxiosToastError(error);
      } finally {
         setLoading(false);
      };
   };



   return (
      <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
         <div ref={editCategoryRef} className='bg-white max-w-4xl w-full p-4 rounded mt-11'>
            <div className='flex items-center justify-between'>
               <h1 className='font-semibold'>Обновить категорию</h1>
               <button className='w-fit block ml-auto'>
                  <IoClose onClick={setCloseEdit} size={25} />
               </button>
            </div>
            <form onSubmit={handleSubmit} className='my-3 grid gap-2'>

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
                              <img
                                 alt='category'
                                 src={data.image}
                                 className='w-full h-full object-scale-down'
                              />
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

                        <input onChange={handleUploadCategoryImage} disabled={!data.name} type='file' id='uploadCategoryImage' className='hidden' />
                     </label>

                  </div>
               </div>

               <button
                  className={`
               ${data.name && data.image ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300 "}
               py-2    
               font-semibold 
               `}
               >Обновить</button>
            </form>
         </div>
      </section>
   )
}

export default EditCategory
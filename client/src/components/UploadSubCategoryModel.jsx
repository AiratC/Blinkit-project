import React, { useEffect, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';


const UploadSubCategoryModel = ({ setCloseAddSubCategory, fetchSubCategory }) => {
   const [subCategoryData, setSubCategoryData] = useState({
      name: "",
      image: "",
      category: []
   })
   const subCategoryRef = useRef(null);
   const allCategory = useSelector((state) => state.product.allCategory);


   useEffect(() => {
      const handleClickOutside = (event) => {
         if (subCategoryRef.current && !subCategoryRef.current.contains(event.target)) {
            setCloseAddSubCategory();
         }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => document, removeEventListener("mousedown", handleClickOutside);

   }, [subCategoryRef])


   const handleChange = (event) => {
      const { name, value } = event.target;

      setSubCategoryData((prev) => {
         return {
            ...prev,
            [name]: value
         }
      })
   }

   const handleUploadSubCategoryImage = async (event) => {
      const file = event.target.files[0];

      if (!file) {
         return
      };

      try {

         const response = await uploadImage(file);
         const { data: ImageResponse } = response;

         setSubCategoryData((prev) => {
            return {
               ...prev,
               image: ImageResponse.data.url
            };
         });

      } catch (error) {
         console.log(error)
         AxiosToastError(error)
      }


   }

   const handleRemoveCategorySelected = (id) => {

      const copySubCategoryData = { ...subCategoryData };

      let category = copySubCategoryData.category.filter((item, index) => {
         if (item._id !== id) return item;
      });;

      setSubCategoryData((prev) => {
         return {
            ...prev,
            category: [...category]
         }
      })
   }

   const handleSubmitSubCategory = async (event) => {
      event.preventDefault();

      try {
         const response = await Axios({
            ...SummaryApi.createSubCategory,
            data: subCategoryData
         });

         const { data: responseData } = response;

         if (responseData.success) {
            toast.success(responseData.message);
            if (setCloseAddSubCategory) {
               setCloseAddSubCategory()
            }

            if(fetchSubCategory) {
               fetchSubCategory()
            }
         }

      } catch (error) {
         AxiosToastError(error)
      }

   };

   const handleChangeSelectCategory = (event) => {

      const value = event.target.value
      if (!value) return;

      // !!! Проверяем повторный выбор категории
      const checkCategory = subCategoryData.category.length >= 1 ? subCategoryData.category.find(el => el._id === value) : null;
      if (checkCategory) return;

      const categoryDetails = allCategory.find(el => el._id === value);

      setSubCategoryData((preve) => {
         return {
            ...preve,
            category: [...preve.category, categoryDetails]
         }
      })

   }



   return (
      <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
         <div ref={subCategoryRef} className='w-full max-w-5xl bg-white p-4 rounded'>
            <div className='flex items-center justify-between gap-3'>
               <h1 className='font-semibold'>Добавить подкатегорию</h1>
               <button onClick={setCloseAddSubCategory}>
                  <IoClose size={25} />
               </button>
            </div>
            <form className='my-3 grid gap-3' onSubmit={handleSubmitSubCategory}>

               <div className='grid gap-1'>
                  <label htmlFor='name'>Название подкатегории</label>
                  <input
                     id='name'
                     name='name'
                     value={subCategoryData.name}
                     onChange={handleChange}
                     className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded '
                  />
               </div>

               <div className='grid gap-1'>
                  <p>Изображение</p>
                  <div className='flex flex-col lg:flex-row items-center gap-3'>

                     <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                        {
                           !subCategoryData.image ? (
                              <p className='text-sm text-neutral-400'>Нет изображения</p>
                           ) : (
                              <img
                                 alt='subCategory'
                                 src={subCategoryData.image}
                                 className='w-full h-full object-scale-down'
                              />
                           )
                        }
                     </div>

                     <label htmlFor='uploadSubCategoryImage'>
                        <div className='px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer  '>
                           Загрузить изображение
                        </div>
                        <input
                           type='file'
                           id='uploadSubCategoryImage'
                           className='hidden'
                           onChange={handleUploadSubCategoryImage}
                        />
                     </label>

                  </div>
               </div>

               <div className='grid gap-1'>
                  <label>Выберите категорию</label>
                  <div className='border focus-within:border-primary-200 rounded'>
                     {/*display value**/}
                     <div className='flex flex-wrap gap-2'>
                        {
                           subCategoryData.category.map((cat, index) => {
                              return (
                                 <div key={cat._id + "selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>
                                    {cat.name}
                                    <div className='cursor-pointer hover:text-red-600' onClick={() => handleRemoveCategorySelected(cat._id)}>
                                       <IoClose size={20} />
                                    </div>
                                 </div>
                              )
                           })
                        }
                     </div>

                     {/*select category**/}
                     <select
                        className='w-full p-2 bg-transparent outline-none border'
                        onChange={handleChangeSelectCategory}
                     >
                        <option value={""}>Выберите категорию</option>
                        {
                           allCategory.map((category, index) => {
                              return (
                                 <option value={category?._id} key={category._id + "subcategory"}>{category?.name}</option>
                              )
                           })
                        }
                     </select>
                  </div>
               </div>

               <button
                  className={`px-4 py-2 border
                           ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-200"}    
                           font-semibold
                        `}
               >
                  Отправить
               </button>

            </form>
         </div>
      </section>
   )
}

export default UploadSubCategoryModel
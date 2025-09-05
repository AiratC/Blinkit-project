import React, { useState } from 'react'
import Loading from '../components/Loading';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import AxiosToastError from '../utils/AxiosToastError';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import successAlert from '../utils/successAlert';

const UploadProduct = () => {
   const [data, setData] = useState({
      name: "",
      image: [],
      category: [],
      subCategory: [],
      unit: "",
      stock: "",
      price: "",
      discount: "",
      description: "",
      more_details: {}
   });
   const [imageLoading, setImageLoading] = useState(false);
   const [viewImageURL, setViewImageURL] = useState("");
   const allCategory = useSelector((state) => state.product.allCategory);
   const allSubCategory = useSelector((state) => state.product.allSubCategory);
   const [selectCategory, setSelectCategory] = useState("");
   const [selectSubCategory, setSelectSubCategory] = useState("");
   const [moreField, setMoreField] = useState([]);
   const [openAddField, setOpenAddField] = useState(false);
   const [fieldName, setFieldName] = useState("");


   // Ввод
   const handleChange = (event) => {
      const { name, value } = event.target;

      setData((prev) => {
         return {
            ...prev,
            [name]: value
         };
      });
   };

   // Загрузка изображения
   const handleUploadImage = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
         setImageLoading(true);
         const response = await uploadImage(file);
         const { data: responseData } = response;
         const imageUrl = responseData.data.url;

         setData((prev) => {
            return {
               ...prev,
               image: [...prev.image, imageUrl]
            };
         });

      } catch (error) {
         AxiosToastError(error);
      } finally {
         setImageLoading(false)
      }


   };

   // Выборка категории
   const handleChangeSelectCategory = (e) => {
      const value = e.target.value

      // !!! Повторно категорию не добавляем
      const checkCategory = data.category.find((category) => {
         if (category._id === value) return category;
      })

      if (checkCategory) return;


      const category = allCategory.find(el => el._id === value);

      setData((preve) => {
         return {
            ...preve,
            category: [...preve.category, category],
         }
      })
      setSelectCategory("")
   }

   // Выборка подкатегории
   const handleChangeSelectSubCategory = (e) => {
      const value = e.target.value

      // !!! Повторно подкатегорию не добавляем
      const checkSubCategory = data.subCategory.find((subCategory) => {
         if (subCategory._id === value) return subCategory;
      })

      if (checkSubCategory) return;

      const subCategory = allSubCategory.find(el => el._id === value)

      setData((preve) => {
         return {
            ...preve,
            subCategory: [...preve.subCategory, subCategory]
         }
      })
      setSelectSubCategory("")
   }

   // Удаление изображения
   const handleDeleteImage = (index) => {
      const copyData = { ...data };
      copyData.image.splice(index, 1);

      setData(copyData)
   }

   // Удаление категории
   const handleRemoveCategory = (index) => {
      const copyData = { ...data };
      copyData.category.splice(index, 1);

      setData(copyData)
   };

   // Удаление подкатегории
   const handleRemoveSubCategory = (index) => {
      const copyData = { ...data };
      copyData.subCategory.splice(index, 1);

      setData(copyData);
   };

   // Добавление поля
   const handleAddField = () => {
      setData((prev) => {
         return {
            ...prev,
            more_details: {
               ...prev.more_details,
               [fieldName]: ""
            }
         };
      });

      setFieldName("");
      setOpenAddField(false);
   }

   // Отправка формы
   const handleSubmit = async (event) => {
      event.preventDefault();

      try {
         const response = await Axios({
            ...SummaryApi.createProduct,
            data: data
         });

         const { data: responseData } = response;

         if (responseData.success) {
            successAlert(responseData.message);
            setData({
               name: "",
               image: [],
               category: [],
               subCategory: [],
               unit: "",
               stock: "",
               price: "",
               discount: "",
               description: "",
               more_details: {}
            })
         };


      } catch (error) {
         console.log(error)
         AxiosToastError(error)
      }
   };



   return (
      <section className=''>
         <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Загрузить продукт</h2>
         </div>

         <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>

               <div className='grid gap-1'>
                  <label htmlFor='name' className='font-medium'>Название</label>
                  <input
                     id='name'
                     type='text'
                     placeholder='Введите название продукта'
                     name='name'
                     value={data.name}
                     onChange={handleChange}
                     required
                     className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='description' className='font-medium'>Описание</label>
                  <textarea
                     id='description'
                     type='text'
                     placeholder='Введите описание'
                     name='description'
                     value={data.description}
                     onChange={handleChange}
                     required
                     multiple
                     rows={3}
                     className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                  />
               </div>

               <div>
                  <p className='font-medium'>Изображение</p>
                  <div>
                     <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                        <div className='text-center flex justify-center items-center flex-col'>
                           {
                              imageLoading ? <Loading /> : (
                                 <>
                                    <FaCloudUploadAlt size={35} />
                                    <p>Загрузить изображение</p>
                                 </>
                              )
                           }
                        </div>
                        <input
                           type='file'
                           id='productImage'
                           className='hidden'
                           accept='image/*'
                           onChange={handleUploadImage}
                        />
                     </label>
                     {/**display uploded image*/}
                     <div className='flex flex-wrap gap-4'>
                        {
                           data.image.map((img, index) => {
                              return (
                                 <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                                    <img
                                       src={img}
                                       alt={img}
                                       className='w-full h-full object-scale-down cursor-pointer'
                                       onClick={() => setViewImageURL(img)}
                                    />
                                    <div onClick={() => handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                                       <MdDelete />
                                    </div>
                                 </div>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>

               <div className='grid gap-1'>
                  <label className='font-medium'>Категория</label>
                  <div>
                     <select
                        className='bg-blue-50 border w-full p-2 rounded'
                        value={selectCategory}
                        onChange={handleChangeSelectCategory}>
                        <option value={""}>Выбрать категорию</option>
                        {
                           allCategory.map((c, index) => {
                              return (
                                 <option key={c?._id} value={c?._id}>{c.name}</option>
                              )
                           })
                        }
                     </select>
                     <div className='flex flex-wrap gap-3'>
                        {
                           data.category.map((c, index) => {
                              return (
                                 <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                                    <p>{c.name}</p>
                                    <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                                       <IoClose size={20} />
                                    </div>
                                 </div>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>

               <div className='grid gap-1'>
                  <label className='font-medium'>Подкатегория</label>
                  <div>
                     <select
                        className='bg-blue-50 border w-full p-2 rounded'
                        value={selectSubCategory}
                        onChange={handleChangeSelectSubCategory}
                     >
                        <option value={""} className='text-neutral-600'>Выбрать подкатегорию</option>
                        {
                           allSubCategory.map((c, index) => {
                              return (
                                 <option key={c?._id} value={c?._id}>{c.name}</option>
                              )
                           })
                        }
                     </select>
                     <div className='flex flex-wrap gap-3'>
                        {
                           data.subCategory.map((c, index) => {
                              return (
                                 <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                                    <p>{c.name}</p>
                                    <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveSubCategory(index)}>
                                       <IoClose size={20} />
                                    </div>
                                 </div>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='unit' className='font-medium'>Вес</label>
                  <input
                     id='unit'
                     type='text'
                     placeholder='Введите вес'
                     name='unit'
                     value={data.unit}
                     onChange={handleChange}
                     required
                     className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='stock' className='font-medium'>Количество акций</label>
                  <input
                     id='stock'
                     type='number'
                     placeholder='Введите акцию на продукт'
                     name='stock'
                     value={data.stock}
                     onChange={handleChange}
                     required
                     className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='price' className='font-medium'>Цена</label>
                  <input
                     id='price'
                     type='number'
                     placeholder='Введите цену'
                     name='price'
                     value={data.price}
                     onChange={handleChange}
                     required
                     className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='discount' className='font-medium'>Скидка</label>
                  <input
                     id='discount'
                     type='number'
                     placeholder='Введите скидку'
                     name='discount'
                     value={data.discount}
                     onChange={handleChange}
                     required
                     className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                  />
               </div>


               {/**add more field**/}
               {
                  Object?.keys(data?.more_details)?.map((k, index) => {
                     return (
                        <div key={index} className='grid gap-1'>
                           <label htmlFor={k} className='font-medium'>{k}</label>
                           <input
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e) => {
                                 const value = e.target.value
                                 setData((preve) => {
                                    return {
                                       ...preve,
                                       more_details: {
                                          ...preve.more_details,
                                          [k]: value
                                       }
                                    }
                                 })
                              }}
                              required
                              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                           />
                        </div>
                     )
                  })
               }

               <div onClick={() => setOpenAddField(true)} className=' hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                  Добавить поля
               </div>

               <button
                  className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'
               >
                  Отправить
               </button>
            </form>
         </div>

         {
            viewImageURL && (
               <ViewImage url={viewImageURL} setCloseImageURL={() => setViewImageURL("")} />
            )
         }

         {
            openAddField && (
               //  
               <AddFieldComponent
                  setCloseAddField={() => setOpenAddField(false)}
                  value={fieldName}
                  onChange={(event) => setFieldName(event.target.value)}
                  submit={handleAddField}
               />
            )
         }

      </section>
   )
}

export default UploadProduct
import React, { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import { useForm } from "react-hook-form"
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddress = ({ close }) => {
   const addressRef = useRef(null);
   const { register, handleSubmit, reset } = useForm();
   const { fetchGetAddress } = useGlobalContext();


   const onSubmit = async (data) => {
      try {
         const response = await Axios({
            ...SummaryApi.addAddress,
            data: {
               address_line: data.addressline,
               city: data.city,
               state: data.state,
               pincode: data.pincode,
               country: data.country,
               mobile: data.mobile,
            }
         });

         const { data: responseData } = response;

         if(responseData.success) {
            toast.success(responseData.message);
            if(close) close(), reset();
            fetchGetAddress()


         }
      } catch (error) {
         console.log(error)
         AxiosToastError(error)
      }
   }

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (addressRef.current && !addressRef.current.contains(event.target)) {
            close();
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }


   }, [addressRef]);


   return (
      <section className='bg-black fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-70 h-screen overflow-auto'>
         <div ref={addressRef} className='bg-white p-4 w-full max-w-lg mt-8 mx-auto rounded'>

            <div className='flex justify-between items-center gap-4'>
               <h2 className='font-semibold'>Добавить адрес</h2>
               <button onClick={close} className='hover:text-red-500'>
                  <IoClose size={25} />
               </button>
            </div>

            <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>

               <div className='grid gap-1'>
                  <label htmlFor='addressline'>Адресная строка :</label>
                  <input
                     type='text'
                     id='addressline'
                     className='border bg-blue-50 p-2 rounded'
                     {...register("addressline", { required: true })}
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='city'>Город :</label>
                  <input
                     type='text'
                     id='city'
                     className='border bg-blue-50 p-2 rounded'
                     {...register("city", { required: true })}
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='state'>Область, Республика :</label>
                  <input
                     type='text'
                     id='state'
                     className='border bg-blue-50 p-2 rounded'
                     {...register("state", { required: true })}
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='pincode'>Пин-код :</label>
                  <input
                     type='text'
                     id='pincode'
                     className='border bg-blue-50 p-2 rounded'
                     {...register("pincode", { required: true })}
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='country'>Страна :</label>
                  <input
                     type='text'
                     id='country'
                     className='border bg-blue-50 p-2 rounded'
                     {...register("country", { required: true })}
                  />
               </div>

               <div className='grid gap-1'>
                  <label htmlFor='mobile'>Телефон :</label>
                  <input
                     type='text'
                     id='mobile'
                     placeholder='+79004589900'
                     className='border bg-blue-50 p-2 rounded'
                     {...register("mobile", { required: true })}
                  />
               </div>

               <button type='submit' className='bg-primary-200 w-full  py-2 font-semibold mt-4 hover:bg-primary-100'>Добавить</button>
            </form>
         </div>
      </section>
   )
}

export default AddAddress
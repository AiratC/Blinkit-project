import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
   const [data, setData] = useState(["", "", "", "", "", ""]);
   const navigate = useNavigate();

   const inputRef = useRef([]);
   const location = useLocation();

   useEffect(() => {
      if (!location?.state?.email) {
         navigate('/forgot-password')
      }
   }, [])

   const valideValue = data.every(el => el);

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await Axios({
            ...SummaryApi.forgot_password_otp_verification,
            data: {
               otp: data.join(""),
               email: location?.state?.email
            }
         });

         if (response.data.error) {
            toast.error(response.data.message);
         }

         if (response.data.success) {
            toast.success(response.data.message);
            setData(["", "", "", "", "", ""])
            navigate('/reset-password', {
               state: {
                  data: response.data,
                  email: location?.state?.email
               }
            })
         }

      } catch (error) {
         AxiosToastError(error)
      }

   }



   return (
      <section className='w-full container mx-auto px-2'>
         <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
            <p className='font-semibold text-lg'>Ввод OTP КОД</p>

            <form onSubmit={handleSubmit} className='grid gap-4 mt-6'>
               <div className='grid gap-1'>
                  <label htmlFor="otp">OTP КОД: </label>
                  <div className='flex items-center gap-2 justify-between mt-3'>
                     {
                        data.map((element, index) => {
                           return <input
                              key={`otp-` + index}
                              type="text"
                              id='otp'
                              ref={(ref) => {
                                 inputRef.current[index] = ref;
                                 return ref;
                              }}
                              value={data[index]}
                              onChange={(e) => {
                                 const value = e.target.value;
                                 const newData = [...data];
                                 newData[index] = value;
                                 setData(newData);

                                 if (value && index < 5) {
                                    inputRef.current[index + 1].focus()
                                 }

                              }}
                              maxLength={1}
                              className='
                              bg-blue-50 -full max-w-16 p-2 border rounded outline-none focus:border-primary-200
                              text-center font-semibold'
                           />
                        })
                     }
                  </div>
               </div>
               <button disabled={!valideValue} type='submit' className={`${valideValue ? "bg-green-800 hover:bg-green-700"
                  : "bg-gray-500"}
                text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                  Подтвердить Otp КОД
               </button>
            </form>

            <p>
               Уже есть аккаунт? <Link className='font-semibold text-green-700 hover:text-green-800' to={`/login`}>Вход</Link>
            </p>
         </div>
      </section>
   )
}

export default OtpVerification
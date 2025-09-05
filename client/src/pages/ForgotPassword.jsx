import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData(() => {
      return {
        ...data,
        [name]: value
      }
    })
  }

  const valideValue = Object.values(data).every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/verification-otp', {
         state: data
        })
        setData({
          email: "",
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }

  }



  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='font-semibold text-lg'>Забыли пароль</p>

        <form onSubmit={handleSubmit} className='grid gap-4 mt-6'>
          <div className='grid gap-1'>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id='email'
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
              name='email'
              value={data.email}
              onChange={handleChange}
              placeholder='Введите email'
            />
          </div>

          <button disabled={!valideValue} type='submit' className={`${valideValue ? "bg-green-800 hover:bg-green-700"
            : "bg-gray-500"}
                text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Отправить Otp КОД
          </button>
        </form>

        <p>
          Уже есть аккаунт? <Link className='font-semibold text-green-700 hover:text-green-800' to={`/login`}>Вход</Link>
        </p>
      </div>
    </section>
  )
}

export default ForgotPassword
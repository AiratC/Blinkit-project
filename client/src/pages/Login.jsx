import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios.js';
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice.js';
import fetchUserDetails from '../utils/fetchUserDetails.js';
import { useGlobalContext } from '../provider/GlobalProvider.jsx';


const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false);
  const { fetchCartItem } = useGlobalContext()

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        ...SummaryApi.login,
        data: data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data.data))
        fetchCartItem()

        setData({
          email: "",
          password: "",
        })
        navigate('/')
      }

    } catch (error) {
      AxiosToastError(error)
    }

  }



  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p>Вход</p>

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
          <div className='grid gap-1'>
            <label htmlFor="password">Пароль: </label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                className='w-full outline-none'
                name='password'
                value={data.password}
                onChange={handleChange}
                placeholder='Введите пароль'
              />
              <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>
                {
                  showPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )
                }
              </div>
            </div>
            <Link to={`/forgot-password`} className='block ml-auto hover:text-primary-200'>Забыли пароль?</Link>
          </div>

          <button disabled={!valideValue} type='submit' className={`${valideValue ? "bg-green-800 hover:bg-green-700"
            : "bg-gray-500"}
                text-white py-2 rounded font-semibold my-3 tracking-wide`}>
            Войти
          </button>
        </form>

        <p>
          Ещё нет аккаунта? <Link className='font-semibold text-green-700 hover:text-green-800' to={`/register`}>Регистрация</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
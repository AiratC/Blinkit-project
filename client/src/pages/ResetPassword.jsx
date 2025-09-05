import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import SummaryApi from '../common/SummaryApi.js';
import AxiosToastError from '../utils/AxiosToastError.js';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios.js';


const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const valideValue = Object.values(data).every(el => el);

    useEffect(() => {
        if (!(location?.state?.data?.success)) {
            navigate('/');
        }

        if (location?.state?.email) {
            setData((prev) => {
                return {
                    ...prev,
                    email: location?.state?.email
                }
            })
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData(() => {
            return {
                ...data,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(data.newPassword !== data.confirmPassword) {
           return toast.error("Пароли не совпадают 🤨")
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword,
                data: data
            });

            if (response.data.error) {
                console.log(response.data)
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/login')
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }

        } catch (error) {
            console.log(error)
            AxiosToastError(error)
        }

    }

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <p className='font-semibold text-lg'>Смена пароля</p>

                <form onSubmit={handleSubmit} className='grid gap-4 mt-6'>
                    <div className='grid gap-1'>
                        <label htmlFor="newPassword">Новый пароль: </label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='newPassword'
                                className='w-full outline-none'
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Введите новый пароль'
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
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor="confirmPassword">Подтвердите пароль: </label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='w-full outline-none'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Подтвердите пароль'
                            />
                            <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer'>
                                {
                                    showConfirmPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>

                    </div>
                    <button disabled={!valideValue} type='submit' className={`${valideValue ? "bg-green-800 hover:bg-green-700"
                        : "bg-gray-500"}
                    text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                        Сменить пароль
                    </button>
                </form>

                <p>
                    Уже есть аккаунт? <Link className='font-semibold text-green-700 hover:text-green-800' to={`/login`}>Вход</Link>
                </p>
            </div>
        </section>
    )
}

export default ResetPassword
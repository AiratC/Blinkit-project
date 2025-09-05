import React, { useEffect, useRef, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updateAvatar } from '../store/userSlice';
import toast from 'react-hot-toast';
import { IoClose } from "react-icons/io5";

const UserProfileAvatarEdit = ({ setCloseProfileAvatarEdit }) => {
    const userProfileRef = useRef(null);
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userProfileRef.current && !userProfileRef.current.contains(event.target)) {
                setCloseProfileAvatarEdit()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [userProfileRef]);

    const handleSubmit = (event) => {
        event.preventDefault()
    };

    const handleUploadAvatarImage = async (event) => {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.uploadAvatar,
                data: formData
            });

            if (response.data.success) {
                const { data: responseData } = response;
                dispatch(updateAvatar(responseData.data.avatar));
                toast.success("Изображение загружено")
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900
                 bg-opacity-60 p-4 flex items-center justify-center '>
            <div ref={userProfileRef} className='bg-white max-w-sm w-full rounded p-4 flex flex-col items-center justify-center'>
                <button onClick={setCloseProfileAvatarEdit} 
                        className='text-neutral-800 w-fit block ml-auto'>
                    <IoClose size={25} />
                </button>
                <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                    {
                        user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className='w-full h-full'
                            />
                        ) : (
                            <FaRegUserCircle size={65} />
                        )
                    }
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="uploadProfile">
                        <div className='border border-primary-200 hover:bg-primary-200 px-4 py-1 rounded text-sm my-3 cursor-pointer'>
                            {
                                loading ? (
                                    "Загрузка..."
                                ) : (
                                    "Загрузить"
                                )
                            }
                        </div>
                    </label>
                    <input onChange={handleUploadAvatarImage} type="file" name="" id="uploadProfile" className='hidden' />
                </form>

            </div>
        </section>
    )
}

export default UserProfileAvatarEdit
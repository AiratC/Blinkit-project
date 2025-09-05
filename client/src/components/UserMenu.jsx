import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Divider from './Divider';
import SummaryApi from '../common/SummaryApi.js';
import Axios from '../utils/Axios.js';
import { logout } from '../store/userSlice.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError.js';
import { FiExternalLink } from "react-icons/fi";
import isAdmin from '../utils/isAdmin.js';
import { useGlobalContext } from '../provider/GlobalProvider.jsx';
import { handleAddItemCart } from '../store/cartProductSlice.js';



const UserMenu = ({ handleCloseUserMenu }) => {
   const user = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { fetchCartItem } = useGlobalContext()

   const handleClose = () => {
      if (handleCloseUserMenu) {
         handleCloseUserMenu()
      }
   }

   const handleLogout = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.logout
         });

         if (response.data.success) {
            if (handleCloseUserMenu) {
               handleCloseUserMenu()
            }
            dispatch(logout());
            localStorage.clear();
            dispatch(handleAddItemCart([]));
            toast.success(response.data.message);
            navigate('/')


         }
      } catch (error) {
         AxiosToastError(error)
      }
   }

   return (
      <div>
         <div className='font-semibold'>Мой аккаунт</div>
         <div className='text-sm flex items-center gap-2'>
            <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{isAdmin(user.role) && " ( Админ )"}</span></span>
            <Link onClick={handleClose} to={`/dashboard/profile`} className='hover:text-primary-200'>
               <FiExternalLink />
            </Link>
         </div>
         <Divider />
         <div className='text-sm grid gap-2 mr-3'>

            {
               isAdmin(user.role) && (
                  <Link onClick={handleClose} to={`/dashboard/category`} className='px-2 hover:bg-orange-200 py-1'>Категории</Link>
               )
            }

            {
               isAdmin(user.role) && (
                  <Link onClick={handleClose} to={`/dashboard/sub-category`} className='px-2 hover:bg-orange-200 py-1'>Подкатегории</Link>
               )
            }

            {
               isAdmin(user.role) && (
                  <Link onClick={handleClose} to={`/dashboard/upload-product`} className='px-2 hover:bg-orange-200 py-1'>Загрузить товар</Link>
               )
            }

            {
               isAdmin(user.role) && (
                  <Link onClick={handleClose} to={`/dashboard/product`} className='px-2 hover:bg-orange-200 py-1'>Товары</Link>
               )
            }

            <Link onClick={handleClose} to={`/dashboard/myorders`} className='px-2 hover:bg-orange-200 py-1'>Мои заказы</Link>

            <Link onClick={handleClose} to={`/dashboard/address`} className='px-2 hover:bg-orange-200 py-1'>Сохранить адрес</Link>

            <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Выйти</button>
         </div>
      </div>
   )
}

export default UserMenu
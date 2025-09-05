import React from 'react'
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import { useState } from 'react';
import Loading from './Loading';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { BsCartCheck } from 'react-icons/bs';
import { useGlobalContext } from '../provider/GlobalProvider';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AddToCartButton = ({ data }) => {
   const [loading, setLoading] = useState(false)
   const { fetchCartItem, updateCartItemQuantity, deleteCartItem } = useGlobalContext();
   const cartItems = useSelector(state => state.cartItem.cart);
   const [isAvailableCart, setIsAvailableCart] = useState(false);
   const [qty, setQty] = useState(0);
   const [cartItemsDetails, setCartItemDetails] = useState({})

   const handleAddToCart = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      try {
         setLoading(true);

         const response = await Axios({
            ...SummaryApi.addToCart,
            data: {
               productId: data?._id
            }
         });

         const { data: responseData } = response;

         if (responseData.success) {
            toast.success(responseData.message);
            fetchCartItem()
         }


      } catch (error) {
         AxiosToastError(error)
      } finally {
         setLoading(false)
      }
   }

   // Уменьшит кол-во товара
   const decreaseQty = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if(qty === 1) {
         deleteCartItem(cartItemsDetails?._id);
      } else {
         updateCartItemQuantity(cartItemsDetails?._id, qty - 1);
      };
   };

   // Увеличить кол-во товара
   const increaseQty = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      updateCartItemQuantity(cartItemsDetails?._id, qty + 1)
   }

   // Проверка этого товара в корзине или нет
   useEffect(() => {
      const checkCartItem = cartItems.some(item => item.productId._id === data._id);
      setIsAvailableCart(checkCartItem);

      const product = cartItems.find(item => item.productId._id === data._id);
      setQty(product?.quantity);
      setCartItemDetails(product);

   }, [data, cartItems])

   return (
      <div className='w-full max-w-[150px]'>
         {
            isAvailableCart ? (
               <div className='flex w-full h-full'>
                  <button onClick={decreaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaMinus /></button>

                  <p className='flex-1 w-full font-semibold px-1 flex items-center justify-center'>{qty}</p>

                  <button onClick={increaseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center'><FaPlus /></button>
               </div>
            ) : (
               <button onClick={handleAddToCart} className='bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded'>
                  {loading ? <Loading /> : <BsCartCheck size={24} />}
               </button>
            )
         }

      </div>
   )
}

export default AddToCartButton
import React, { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import DisplayPriceInRub from '../utils/DisplayPriceInRub';
import AddToCartButton from './AddToCartButton';
import { FaCaretRight } from 'react-icons/fa6';
import { useGlobalContext } from '../provider/GlobalProvider';
import priceWithDiscount from '../utils/priceWithDiscount';
import imageEmpty from '../assets/empty_cart.webp'
import toast from 'react-hot-toast';

const DisplayCartItem = ({ setCloseCartSection }) => {
   const cartItem = useSelector(state => state.cartItem.cart);
   const cartRef = useRef(null);
   const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
   const user = useSelector(state => state.user);

   const navigate = useNavigate();


   const redirectToCheckoutPage = () => {
      if(user?._id) {
         navigate('/checkout');
         if(setCloseCartSection) {
            setCloseCartSection()
         }
         return;
      };

      toast("Войдите в аккаунт");
   };

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (cartRef.current && !cartRef.current.contains(event.target)) {
            if (setCloseCartSection) {
               setCloseCartSection();
            } else {
               navigate('/');
            }
            
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => document.removeEventListener("mousedown", handleClickOutside);


   }, [cartRef])

   return (
      <section className='bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50'>
         <div ref={cartRef} className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex items-center p-4 shadow-md gap-3 justify-between'>
               <h2 className='font-semibold'>Корзина</h2>
               <Link to={"/"} className='lg:hidden'>
                  <IoClose size={25} />
               </Link>
               <button onClick={setCloseCartSection} className='hidden lg:block'>
                  <IoClose size={25} />
               </button>
            </div>

            <div className='min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
               {/***display items */}
               {
                  cartItem[0] ? (
                     <>
                        <div className='flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full'>
                           <p>Ваша общая экономия</p>
                           <p>{DisplayPriceInRub(notDiscountTotalPrice - totalPrice)}</p>
                        </div>
                        <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                           {
                              cartItem[0] && (
                                 cartItem.map((item, index) => {
                                    return (
                                       <div key={item?._id + "cartItemDisplay"} className='flex  w-full gap-4'>
                                          <div className='w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded'>
                                             <img
                                                src={item?.productId?.image[0]}
                                                className='object-scale-down'
                                             />
                                          </div>
                                          <div className='w-full max-w-sm text-xs'>
                                             <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                             <p className='text-neutral-400'>{item?.productId?.unit}</p>
                                             <p className='font-semibold'>{DisplayPriceInRub(priceWithDiscount(item?.productId?.price, item?.productId?.discount))}</p>
                                          </div>
                                          <div>
                                             <AddToCartButton data={item?.productId} />
                                          </div>
                                       </div>
                                    )
                                 })
                              )
                           }
                        </div>
                        <div className='bg-white p-4'>
                           <h3 className='font-semibold'>Детали счета</h3>
                           <div className='flex gap-4 justify-between ml-1'>
                              <p>Всего товаров</p>
                              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRub(notDiscountTotalPrice)}</span><span>{DisplayPriceInRub(totalPrice)}</span></p>
                           </div>
                           <div className='flex gap-4 justify-between ml-1'>
                              <p>Общее количество</p>
                              <p className='flex items-center gap-2'>{totalQty} `{`${totalQty === 1 ? "товар" : totalQty >= 2 && totalQty <= 4 ? "товара" : totalQty >= 5 ? "товаров" : "" }`}</p>
                           </div>
                           <div className='flex gap-4 justify-between ml-1'>
                              <p>Стоимость доставки</p>
                              <p className='flex items-center gap-2'>Бесплатно</p>
                           </div>
                           <div className='font-semibold flex items-center justify-between gap-4'>
                              <p >общий итог</p>
                              <p>{DisplayPriceInRub(totalPrice)}</p>
                           </div>
                        </div>
                     </>
                  ) : (
                     <div className='bg-white flex flex-col justify-center items-center'>
                        <img
                           src={imageEmpty}
                           className='w-full h-full object-scale-down'
                        />
                        <Link onClick={setCloseCartSection} to={"/"} className='block bg-green-600 px-4 py-2 text-white rounded'>Купить сейчас</Link>
                     </div>
                  )
               }

            </div>

            {
               cartItem[0] && (
                  <div className='p-2'>
                     <div className='bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between'>
                        <div>
                           {DisplayPriceInRub(totalPrice)}
                        </div>
                        <button onClick={redirectToCheckoutPage} className='flex items-center gap-1'>
                           Продолжить
                           <span><FaCaretRight /></span>
                        </button>
                     </div>
                  </div>
               )
            }

         </div>
      </section>
   )
}

export default DisplayCartItem
import React, { useEffect, useRef, useState } from 'react'
import logo from './../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { FaCartShopping } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { VscTriangleDown } from "react-icons/vsc";
import { VscTriangleUp } from "react-icons/vsc";
import UserMenu from './UserMenu';
import DisplayPriceInRub from '../utils/DisplayPriceInRub';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
   const [isMobile] = useMobile();
   const location = useLocation();
   const navigate = useNavigate();
   const user = useSelector((state) => state.user)
   const [openUserMenu, setOpenUserMenu] = useState(false);
   const refUserMenu = useRef(null);
   const { totalPrice, totalQty, cartItem } = useGlobalContext()
   const [openCartSection, setOpenCartSection] = useState(false);
   // const cartItem = useSelector(state => state.cartItem.cart);
   // const [totalPrice, setTotalPrice] = useState(0);
   // const [totalQty, setTotalQty] = useState(0);


   const isSearchPage = location.pathname === '/search';

   const redirectToLogin = () => {
      navigate(`/login`);
   }

   const handleCloseUserMenu = () => {
      setOpenUserMenu(false);
   };

   const handleMobileUser = () => {
      if (!user._id) {
         navigate('/login');
         return
      }

      navigate('/user');
   }

   // useEffect(() => {
   //    let qty = cartItem.reduce((prev, item) => {
   //       return prev + item.quantity
   //    }, 0)

   //    let totalPrice = cartItem.reduce((prev, item) => {
   //       return (item.quantity * item.productId.price) + prev
   //    }, 0)

   //    setTotalQty(qty);
   //    setTotalPrice(totalPrice);


   // }, [cartItem])


   // Закрывать меню по клику за пределами меню
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (refUserMenu.current && !refUserMenu.current.contains(event.target)) {
            setOpenUserMenu(false)
         }
      }

      document.addEventListener('mousedown', handleClickOutside);

      return () => document.removeEventListener('mousedown', handleClickOutside);

   }, [refUserMenu]);

   return (
      <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
         {
            !(isSearchPage && isMobile) && (
               <div className='container mx-auto flex items-center px-4 justify-between'>
                  {/* Логотип */}
                  <div className='h-full'>
                     <Link to={`/`} className='h-full flex justify-center items-center'>
                        <img
                           src={logo}
                           width={170}
                           height={60}
                           alt='logo'
                           className='hidden lg:block'
                        />
                        <img
                           src={logo}
                           width={120}
                           height={60}
                           alt='logo'
                           className='lg:hidden'
                        />
                     </Link>
                  </div>

                  {/* Поисковик */}
                  <div className='hidden lg:block'>
                     <Search />
                  </div>

                  {/* Вход и Корзина */}
                  <div className=''>
                     {/* Отображается только на мобилке */}
                     <button onClick={handleMobileUser} className='text-neutral-600 lg:hidden'>
                        <FaRegCircleUser size={26} />
                     </button>

                     {/* Только на компьютере */}
                     <div className='hidden lg:flex items-center gap-10'>
                        {
                           user?._id ? (
                              <div ref={refUserMenu} className='relative'>
                                 <div onClick={(e) => setOpenUserMenu(prev => !prev)} className='flex select-none items-center gap-2 cursor-pointer'>
                                    <p>Аккаунт</p>
                                    {
                                       openUserMenu ? (
                                          <VscTriangleUp size={25} />
                                       ) : (
                                          <VscTriangleDown size={25} />
                                       )
                                    }
                                 </div>
                                 {
                                    openUserMenu && (
                                       <div className='absolute right-0 top-12'>
                                          <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                             <UserMenu handleCloseUserMenu={handleCloseUserMenu} />
                                          </div>
                                       </div>
                                    )
                                 }
                              </div>
                           ) : (
                              <button onClick={redirectToLogin} className='text-lg px-2'>Вход</button>
                           )
                        }

                        <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-2 bg-green-800 hover:bg-green-700  px-3 py-3 rounded text-white'>
                           <div className='animate-bounce'>
                              <BsCart4 size={26} />
                           </div>
                           <div className='font-semibold'>
                              {
                                 cartItem[0] ? (
                                    <div>
                                       <p>{totalQty}</p>
                                       <p>{DisplayPriceInRub(totalPrice)}</p>
                                    </div>
                                 ) : (
                                    <p>Корзина</p>
                                 )
                              }
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            )
         }
         <div className='container mx-auto px-2 lg:hidden'>
            <Search />
         </div>

         {
            openCartSection && (
               <DisplayCartItem setCloseCartSection={() => setOpenCartSection(false)} />
            )
         }
      </header>
   )
}

export default Header
import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [isSearchPage, setIsSearchPage] = useState(false);
   const [isMobile] = useMobile();

   const searchText = useLocation();
   const queryParams = new URLSearchParams(searchText.search);
   const encodedQuery = queryParams.get('q'); // Получаем закодированный текст
   let decodedQuery = ""
   if (encodedQuery) {
      decodedQuery = decodeURIComponent(encodedQuery); // Декодируем текст
   }

   useEffect(() => {
      const isSearch = location.pathname === "/search";

      if (isSearch) {
         setIsSearchPage(isSearch);
      } else {
         setIsSearchPage(false)
      }

   }, [location]);

   const redirectToSearchPage = () => {
      navigate('/search')
   }

   const handleOnChange = (event) => {
      const value = event.target.value;
      const url = `/search?q=${value}`;

      navigate(url)

   }

   return (
      <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-600 bg-slate-50 group focus-within:border-primary-200'>
         <div>

            {
               (isMobile && isSearchPage) ? (
                  <Link to={`/`} className='flex justify-center items-center h-full p-2 m-1 group-focus-within:text-primary-200 bg-white rounded-full shadow-md'>
                     <FaArrowLeft size={20} />
                  </Link>
               ) : (
                  <button className='flex justify-center items-center h-full p-3 group-focus-within:text-primary-200'>
                     <IoSearch size={22} />
                  </button>
               )
            }

         </div>
         <div className='w-full h-full'>
            {
               !isSearchPage ? (
                  <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                     <TypeAnimation
                        sequence={[
                           'Поиск "Молока"',
                           1000,
                           'Поиск "Хлеба"',
                           1000,
                           'Поиск "Сахара"',
                           1000,
                           'Поиск "Шоколада"',
                           1000
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                     />
                  </div>
               ) : (
                  <div className='w-full h-full'>
                     <input
                        type="text"
                        placeholder='Поиск...'
                        autoFocus
                        defaultValue={decodedQuery}
                        className='bg-transparent w-full h-full outline-none'
                        onChange={handleOnChange}
                     />
                  </div>
               )
            }
         </div>
      </div>
   )
}

export default Search
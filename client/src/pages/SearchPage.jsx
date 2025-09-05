import React, { useState } from 'react'
import CardLoading from '../components/CardLoading';
import CardProduct from '../components/CardProduct';
import InfiniteScroll from 'react-infinite-scroll-component';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import noDataImage from '../assets/nothing-here-yet.webp'

const SearchPage = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const loadingArrayCard = new Array(10).fill(null);
   const [page, setPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);

   const searchText = useLocation();
   const queryParams = new URLSearchParams(searchText.search);
   const encodedQuery = queryParams.get('q'); // Получаем закодированный текст
   let decodedQuery = ""
   if (encodedQuery) {
      decodedQuery = decodeURIComponent(encodedQuery); // Декодируем текст
   }


   const fetchData = async () => {
      try {
         setLoading(true)
         const response = await Axios({
            ...SummaryApi.searchProduct,
            data: {
               search: decodedQuery,
               page: page,
               limit: 50
            }
         });

         const { data: responseData } = response;

         if (responseData.success) {
            if (page === 1) {
               setData(responseData.data)
            } else {
               setData((prev) => {
                  return [
                     ...prev,
                     ...responseData.data
                  ]
               })
            }

            setTotalPage(responseData.totalPage)
         }
      } catch (error) {
         AxiosToastError(error)
      } finally {
         setLoading(false)
      };
   };

   const handleFetchMore = () => {
      if (totalPage > page) {
         setPage((prevPage) => {
            return prevPage + 1
         })
      }
   };

   useEffect(() => {
      let flag = true;

      let idTimeout = setTimeout(() => {
         if (flag) {
            fetchData();
            flag = false
         }
      }, 500);

      return () => clearTimeout(idTimeout)

   }, [page, searchText])

   return (
      <section className='bg-white'>
         <div className='container mx-auto p-4'>
            <p className='font-semibold'>Результаты поиска: {data.length}  </p>

            <InfiniteScroll
               dataLength={data.length}
               hasMore={true}
               next={handleFetchMore}
            >
               <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
                  {
                     data.map((p, index) => {
                        return (
                           <CardProduct data={p} key={p?._id + "searchProduct" + index} />
                        )
                     })
                  }

                  {/***loading data */}
                  {
                     loading && (
                        loadingArrayCard.map((_, index) => {
                           return (
                              <CardLoading key={"loadingsearchpage" + index} />
                           )
                        })
                     )
                  }
               </div>
            </InfiniteScroll>

            {
               //no data 
               !data[0] && !loading && (
                  <div className='flex flex-col justify-center items-center w-full mx-auto'>
                     <img
                        src={noDataImage}
                        className='w-full h-full max-w-xs max-h-xs block'
                     />
                     <p className='font-semibold my-2'>Товары не найдены</p>
                  </div>
               )
            }
         </div>
      </section>
   )
}

export default SearchPage
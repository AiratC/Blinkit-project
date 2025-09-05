import React, { Fragment, useEffect, useRef, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { useSelector } from 'react-redux';
import valideUrlConvert from '../utils/valideUrlConvert';

const CategoryWiseProductDisplay = ({ id, name }) => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const containerRef = useRef();
   const categoryData = useSelector((state) => state.product.allCategory);
   const subCategoryData = useSelector((state) => state.product.allSubCategory);

   const handleRedirectProductListpage = (categoryID, categoryName) => {

      const subcategory = subCategoryData.find(sub => {
         const filterData = sub.category.some(c => {
            return c._id === categoryID
         });

         return filterData ? true : null 
      });

      if(!subcategory) return;

      const url = valideUrlConvert(`/${categoryName}-${categoryID}/${subcategory.name}-${subcategory._id}`);
      
      return url
   }

   const loadingCardNumber = new Array(6).fill(null)

   const fetchCategoryWiseProduct = async () => {
      try {
         setLoading(true)
         const response = await Axios({
            ...SummaryApi.getProductByCategory,
            data: {
               id: id
            }
         });

         const { data: responseData } = response;

         if (responseData.success) {
            setData(responseData.data);
         };


      } catch (error) {
         console.log(error)
         AxiosToastError(error)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchCategoryWiseProduct()
   }, [])

   const handleScrollLeft = () => {
      containerRef.current.scrollLeft -= 200
   };

   const handleScrollRight = () => {
      containerRef.current.scrollLeft += 200
   };

   return (
      <div>
         {
            data.length === 0 ? (
               <Fragment></Fragment>
            ) : (
               <Fragment>
                  <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                     <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                     <Link to={handleRedirectProductListpage(id, name)} className='text-green-600 hover:text-green-400'>Все</Link>
                  </div>
                  <div className='relative flex items-center '>
                     <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
                        {
                           loading && (
                              loadingCardNumber.map((_, index) => {
                                 return (
                                    <CardLoading key={index} />
                                 )
                              })
                           )

                        }

                        {
                           data.map((product, index) => {
                              return (
                                 <CardProduct key={product._id} data={product} />
                              )
                           })
                        }
                     </div>
                     <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
                        <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full'>
                           <FaAngleLeft />
                        </button>
                        <button onClick={handleScrollRight} className='z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full'>
                           <FaAngleRight />
                        </button>
                     </div>
                  </div>
               </Fragment>
            )
         }

      </div>
   )
}

export default CategoryWiseProductDisplay
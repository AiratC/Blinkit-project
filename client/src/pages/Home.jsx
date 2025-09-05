import React from 'react'
import banner from './../assets/banner.jpg';
import bannerMobile from './../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import valideUrlConvert from '../utils/valideUrlConvert';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';


const Home = () => {
   const loadingCategory = useSelector((state) => state.product.loadingCategory);
   const categoryData = useSelector((state) => state.product.allCategory);
   const subCategoryData = useSelector((state) => state.product.allSubCategory);
   const navigate = useNavigate();

   const handleRedirectProductListpage = (categoryID, categoryName) => {

      const subcategory = subCategoryData.find(sub => {
         const filterData = sub.category.some(c => {
            return c._id === categoryID
         });

         return filterData ? true : null 
      });

      if(!subcategory) return;

      const url = valideUrlConvert(`/${categoryName}-${categoryID}/${subcategory.name}-${subcategory._id}`);
      
      navigate(url)
   }

   return (
      <section className='bg-white'>
         <div className='container mx-auto'>
            <div className={`h-full w-full bg-blue-100 min-h-48 rounded ${!banner && 'animate-pulse'} `}>
               <img
                  src={banner}
                  className='w-full h-full hidden lg:block'
                  alt="banner"
               />
               <img
                  src={bannerMobile}
                  className='w-full h-full lg:hidden'
                  alt="bannerMobile"
               />
            </div>
         </div>

         <div className='container mx-auto px-4 my-2 grid grid-cols-3 md:grid-cols-8 lg:grid-cols-10  gap-2'>
            {
               loadingCategory ? (
                  new Array(12).fill(null).map((category, index) => {
                     return (
                        <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                           <div className='bg-blue-100 min-h-24 rounded'></div>
                           <div className='bg-blue-100 h-8 rounded'></div>
                        </div>
                     )
                  })
               ) : (
                  categoryData.map((category, index) => {
                     return (
                        <div key={category._id + "displayCategory"} className='w-full h-full cursor-pointer' onClick={() => handleRedirectProductListpage(category._id, category.name)}>
                           <div>
                              <img
                                 src={category.image}
                                 className='w-full h-full object-scale-down'
                              />
                           </div>
                        </div>
                     )
                  })
               )

            }
         </div>

         {
            categoryData.map((category, index) => {
               return (
                  <CategoryWiseProductDisplay key={category._id} id={category?._id} name={category?.name}/>
               )
            })
         }
      </section>
   )
}

export default Home
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import fetchUserDetails from './utils/fetchUserDetails.js';
import { useEffect } from 'react';
import { setUserDetails } from './store/userSlice.js';
import { useDispatch } from 'react-redux';
import AxiosToastError from './utils/AxiosToastError.js';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice.js';
import Axios from './utils/Axios.js';
import SummaryApi from './common/SummaryApi.js';
import GlobalProvider from './provider/GlobalProvider.jsx';
import CartMobileLink from './components/CartMobile.jsx';


function App() {

   const dispatch = useDispatch();
   const location = useLocation();

   const fetchUser = async () => {
      try {
         const userData = await fetchUserDetails();
         dispatch(setUserDetails(userData.data.data))
      } catch (error) {
         AxiosToastError(error)
      }
   };

   const fetchCategory = async () => {
      try {
         dispatch(setLoadingCategory(true))
         const response = await Axios({
            ...SummaryApi.getCategory
         })

         const { data: responseData } = response;

         if (responseData.success) {
            dispatch(setAllCategory(responseData.data))
         };

      } catch (error) {
         AxiosToastError(error)
      } finally {
         dispatch(setLoadingCategory(false))
      }
   }

   const fetchSubCategory = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.getSubCategory
         })

         const { data: responseData } = response;

         if (responseData.success) {
            dispatch(setAllSubCategory(responseData.data))
         };

      } catch (error) {
         AxiosToastError(error)
      } finally {
      }
   }



   useEffect(() => {
      fetchUser();
      fetchCategory();
      fetchSubCategory();
      //  fetchCartItem();
   }, [])

   return (
      <GlobalProvider>
         <Header />
         <main className='min-h-[78vh]'>
            <Outlet />
         </main>
         <Footer />
         <Toaster />
         {
            location.pathname !== '/checkout' && (
               <CartMobileLink />
            )
         }
      </GlobalProvider>
   )
}

export default App

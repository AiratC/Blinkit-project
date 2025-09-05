import { useContext } from "react";
import { createContext } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProductSlice";
import { useEffect } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useState } from "react";
import priceWithDiscount from "../utils/priceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
   const [totalPrice, setTotalPrice] = useState(0);
   const [totalQty, setTotalQty] = useState(0);
   const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
   const cartItem = useSelector(state => state.cartItem.cart);
   const user = useSelector(state => state.user)
   const dispatch = useDispatch();


   const fetchCartItem = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.getCartItem
         });

         const { data: responseData } = response;
         if (responseData.success) {
            dispatch(handleAddItemCart(responseData.data))
         }
      } catch (error) {
         AxiosToastError(error)
      }
   }

   const updateCartItemQuantity = async (id, quantity) => {
      try {
         const response = await Axios({
            ...SummaryApi.updateCartQuantity,
            data: {
               _id: id,
               quantity: quantity
            }
         });

         const { data: responseData } = response;

         if (responseData.success) {
            toast.success(responseData.message);
            fetchCartItem();
         }
      } catch (error) {
         AxiosToastError(error);
      }
   }

   const deleteCartItem = async (cartId) => {
      try {
         const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data: {
               _id: cartId
            }
         });

         const { data: responseData } = response;

         if (responseData.success) {
            toast.success(responseData.message);
            fetchCartItem()
         }
      } catch (error) {
         AxiosToastError(error)
      }
   }

   const handleLogout = () => {
      localStorage.clear();
      dispatch(handleAddItemCart([]))
   };

   const fetchGetAddress = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.getAddress
         });

         const { data: responseData } = response;
         if(responseData.success) {
            dispatch(handleAddAddress(responseData.data))
         };

      } catch (error) {
         AxiosToastError(error)
      }
   }

   const fetchOrder = async () => {
      try {
         const response = await Axios({
            ...SummaryApi.getOrderItems
         });

         const { data: responseData } = response;

         if(responseData.success) {
            dispatch(setOrder(responseData.data))
         }
      } catch (error) {
         AxiosToastError(error)
      }
   } 

   useEffect(() => {
      fetchCartItem();
      handleLogout();
      fetchGetAddress();
      fetchOrder();
   }, [user]);

   useEffect(() => {
      let qty = cartItem.reduce((prev, item) => {
         return prev + item.quantity
      }, 0)

      

      let totalPrice = cartItem.reduce((prev, item) => {
         const priceAfterDiscount = priceWithDiscount(item?.productId?.price, item?.productId?.discount)
         return prev + (priceAfterDiscount  * item.quantity)
      }, 0);

      let notDiscountPrice = cartItem.reduce((prev, item) => {
         return prev + (item?.productId?.price * item.quantity)
      }, 0);

      setTotalQty(qty);
      setTotalPrice(totalPrice);
      setNotDiscountTotalPrice(notDiscountPrice);



   }, [cartItem])




   return (
      <GlobalContext value={{
         fetchCartItem,
         updateCartItemQuantity,
         deleteCartItem,
         totalPrice,
         totalQty,
         cartItem,
         notDiscountTotalPrice,
         fetchGetAddress,
         fetchOrder
      }}
      >
         {children}
      </GlobalContext>
   )
}


export default GlobalProvider;
import React, { useState } from 'react'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';


const Address = () => {
   const [openAddress, setOpenAddress] = useState(false);
   const [openEdit, setOpenEdit] = useState(false);
   const [editData, setEditData] = useState({});
   const addressList = useSelector(state => state.address.addressList)
   const { fetchGetAddress } = useGlobalContext();
   
   const handleDisableAddress = async (_id) => {
      try {
         const response = await Axios({
            ...SummaryApi.disableAddress,
            data: {
               _id: _id
            }
         });

         const { data: responseData } = response;

         if(responseData.success) {
            toast.success(responseData.message);
            fetchGetAddress();
         }
      } catch (error) {
         console.log(error)
         AxiosToastError(error)
      }
   }

   return (
      <div className=''>
         <div className='bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center '>
            <h2 className='font-semibold text-ellipsis line-clamp-1'>Адреса</h2>
            <button onClick={() => setOpenAddress(true)} className='border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full'>
               Добавить адрес
            </button>
         </div>
         <div className='bg-blue-50 p-2 grid gap-4'>
            {
               addressList.map((address, index) => {
                  return (
                     <div key={address._id} className={`border rounded p-3 flex gap-3 bg-white ${!address.status && 'hidden'}`}>
                        <div className='w-full'>
                           <p>{address.address_line}</p>
                           <p>{address.city}</p>
                           <p>{address.state}</p>
                           <p>{address.country} - {address.pincode}</p>
                           <p>{address.mobile}</p>
                        </div>
                        <div className=' grid gap-10'>
                           <button onClick={() => {
                              setOpenEdit(true)
                              setEditData(address)
                           }} className='bg-green-200 p-1 rounded  hover:text-white hover:bg-green-600'>
                              <MdEdit />
                           </button>
                           <button onClick={() =>
                              handleDisableAddress(address._id)
                           } className='bg-red-200 p-1 rounded hover:text-white hover:bg-red-600'>
                              <MdDelete size={20} />
                           </button>
                        </div>
                     </div>
                  )
               })
            }
            {/* <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
               Add address
            </div> */}
         </div>

         {
            openAddress && (
               <AddAddress close={() => setOpenAddress(false)} />
            )
         }

         {
            openEdit && (
               <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
            )
         }
      </div>
   )
}

export default Address
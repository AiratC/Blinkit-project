import toast from "react-hot-toast";

const AxiosToastError = (error) => {
   return toast.error(
      error?.response?.data?.message
   )
}

export default AxiosToastError;

export const baseURL = https://blinkit-project-server.onrender.com;

const SummaryApi = {
   register: {
      url: '/api/user/register',
      method: 'post'
   },
   login: {
      url: '/api/user/login',
      method: 'post'
   },
   forgot_password: {
      url: '/api/user/forgot-password',
      method: 'put'
   },
   forgot_password_otp_verification: {
      url: '/api/user/verify-forgot-password-otp',
      method: 'put'
   },
   resetPassword: {
      url: '/api/user/reset-password',
      method: 'put'
   },
   refreshToken: {
      url: '/api/user/refresh-token',
      method: 'post'
   },
   userDetails: {
      url: '/api/user/user-details',
      method: 'get'
   },
   logout: {
      url: '/api/user/logout',
      method: 'get'
   },
   uploadAvatar: {
      url: '/api/user/upload-avatar',
      method: 'put'
   },
   updateUserDetails: {
      url: '/api/user/update-details',
      method: 'put'
   },
   addCategory: {
      url: '/api/category/add-category',
      method: 'post'
   },
   uploadImage: {
      url: '/api/file/upload',
      method: 'post'
   },
   getCategory: {
      url: '/api/category/get-category',
      method: "get"
   },
   updateCategory: {
      url: '/api/category/update-category',
      method: "put"
   }
   ,
   deleteCategory: {
      url: '/api/category/delete-category',
      method: 'delete'
   },
   createSubCategory: {
      url: '/api/sub-category/create-sub-category',
      method: 'post'
   },
   getSubCategory: {
      url: '/api/sub-category/get-sub-category',
      method: 'post'
   },
   updateSubCategory: {
      url: '/api/sub-category/update-sub-category',
      method: 'put'
   },
   deleteSubCategory: {
      url: '/api/sub-category/delete-sub-category',
      method: 'delete'
   },
   createProduct: {
      url: '/api/product/create-product',
      method: 'post'
   },
   getProduct: {
      url: '/api/product/get-product',
      method: 'post'
   },
   getProductByCategory: {
      url: '/api/product/get-product-by-category',
      method: 'post'
   },
   getProductByCategoryAndSubcategory: {
      url: '/api/product/get-product-by-category-and-subcategory',
      method: 'post'
   },
   getProductDetails: {
      url: '/api/product/get-product-details',
      method: 'post'
   },
   updateProductDetails: {
      url: '/api/product/update-product-details',
      method: 'put'
   },
   deleteProductDetails: {
      url: '/api/product/delete-product',
      method: 'delete'
   },
   searchProduct: {
      url: '/api/product/search-product',
      method: 'post'
   },
   addToCart: {
      url: '/api/cart/add-to-cart',
      method: 'post'
   },
   getCartItem: {
      url: '/api/cart/get-cart-item',
      method: 'get'
   },
   updateCartQuantity: {
      url: '/api/cart/update-cart-quantity',
      method: 'put'
   },
   deleteCartItem: {
      url: '/api/cart/delete-cart-product',
      method: 'delete'
   },
   addAddress: {
      url: '/api/address/add-address',
      method: 'post'
   },
   getAddress: {
      url: '/api/address/get-address',
      method: 'get'
   },
   updateAddress: {
      url: '/api/address/update-address',
      method: 'put'
   },
   disableAddress: {
      url: '/api/address/disable-address',
      method: 'delete'
   },
   cashOnDeliveryOrder: {
      url: '/api/order/cash-on-delivery',
      method: 'post'
   },
   payment_url: {
      url: '/api/order/checkout',
      method: 'post'
   },
   getOrderItems: {
      url: '/api/order/get-order-details',
      method: 'get'
   }
   
}

export default SummaryApi;

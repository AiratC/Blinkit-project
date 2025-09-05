import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   orderArray: []
};

const orderSlice = createSlice({
   name: 'order',
   initialState,
   reducers: {
      setOrder: (state, action) => {
         state.orderArray = [...action.payload];
      }
   }
});


export const { setOrder } = orderSlice.actions;
export default orderSlice.reducer;
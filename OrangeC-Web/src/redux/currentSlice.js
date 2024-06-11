import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage1: 'ChatWelcome',
  currentPage2: 'ChatWelcome',
  userId: null,
  conversationReload:null
};

const currentSlice = createSlice({
  name: 'current',
  initialState,
  reducers: {
    setCurrentPage1(state, action) {
      state.currentPage1 = action.payload;
    },
    setCurrentPage2(state, action) {
      state.currentPage2 = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setConversationReload(state, action) {
      state.conversationReload = action.payload;
    }
  }
});

export const { setCurrentPage1, setUserId,setConversationReload,setCurrentPage2 } = currentSlice.actions;
export default currentSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';

const stickerSlice = createSlice({
    name: "sticker",
    initialState: {
        stickers: [],
    },
    reducers: {
        setSticker: (state, action) => {
            state.stickers = action.payload;
        },
    },
});

export const { setSticker } = stickerSlice.actions;
export default stickerSlice.reducer;

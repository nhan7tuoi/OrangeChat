import {createSlice} from '@reduxjs/toolkit';
import FriendApi from '../apis/FriendApi';
import authApi from '../apis/authApi';

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    listFriends: [],
    listFriendRequests: [],
    resultSearch: [],
  },
  reducers: {
    setFriends: (state, action) => {
      state.listFriends = action.payload;
    },
    setFriendRequests: (state, action) => {
      state.listFriendRequests = action.payload;
    },
    deleteFriendRequest: (state, action) => {
      state.listFriendRequests = state?.listFriendRequests?.filter(
        fq => fq._id !== action.payload,
      );
    },
    setResultSearch: (state, action) => {
      state.resultSearch = action.payload;
    },
    addFriendRequests: (state, action) => {
      state.listFriendRequests = [...state?.listFriendRequests, action.payload];
    },
    addFriend: (state, action) => {
      state.listFriends = [...state?.listFriends, action.payload];
    },
    deleteFriend: (state, action) => {
      state.listFriends = state?.listFriends?.filter(
        f => f._id !== action.payload,
      );
    },
  },
});

export const {
  setFriends,
  setFriendRequests,
  deleteFriendRequest,
  setResultSearch,
  addFriendRequests,
  addFriend,
  deleteFriend
} = friendSlice.actions;
export const fetchFriends = userId => async dispatch => {
  console.log('fetchFriends', userId);
  try {
    const friends = await FriendApi.getFriends({userId});
    console.log('friends', friends.data);
    dispatch(setFriends(friends.data));
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

export const fetchFriendRequests = userId => async dispatch => {
  try {
    const friendRequests = await FriendApi.getFriendRequests({userId});
    dispatch(setFriendRequests(friendRequests.data));
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
};

export const searchUsers = (userId, keyword) => async dispatch => {
  try {
    if (keyword !== '') {
      const users = await authApi.searchUsers({
        keyword: keyword,
        userId: userId,
      });
      dispatch(setResultSearch(users.data));
    } else {
      dispatch(setResultSearch([]));
    }
  } catch (error) {
    console.error('Error search user:', error);
  }
};

export default friendSlice.reducer;
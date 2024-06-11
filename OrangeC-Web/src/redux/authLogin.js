import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../apis/authApi";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.login(credentials);
      const { token, user } = response;
      localStorage.setItem("token", token);
      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const authenticateUser = createAsyncThunk(
  "auth/authenticateUser",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    try {
      const response = await api.refreshToken({ token });
      const { user, accessToken } = response;
      localStorage.setItem("token", accessToken);
      return { user, token: accessToken };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const authLogin = createSlice({
  name: "authLogin",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    error: null,
    connect: false,
  },
  reducers: {
    setConnect: (state, action) => {
      state.connect = action.payload;
    },
    setAuth: (state, action) => {
      console.log("action", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setAvt: (state, action) => {
      console.log("action.payload.image", action.payload);
      state.user.image = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, setAuth, setConnect, setAvt, setUser } = authLogin.actions;
export default authLogin.reducer;

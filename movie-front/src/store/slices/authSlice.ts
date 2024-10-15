import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import Cookies from "js-cookie";
import axiosInstance from "@/axios";

interface SignInResponse {
  rememberMe: boolean;
  accessToken: string;
  userId: string;
}

interface AuthState {
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

const getInitialState = (): AuthState => {
  const userId = Cookies.get("userId") || "";
  const authToken = Cookies.get("auth_token") || "";

  return {
    userId,
    isAuthenticated: !!userId && !!authToken,
    isLoading: false,
    error: "",
  };
};

const initialState: AuthState = getInitialState();

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;

const extractErrorMessages = (errorData: any): string => {
  if (errorData?.message) {
    if (typeof errorData.message === "string") {
      return errorData.message;
    } else if (Array.isArray(errorData.message)) {
      return errorData.message.join("; ");
    } else if (typeof errorData.message === "object") {
      return Object.values(errorData.message).join("; ");
    }
  }
  return "An unknown error occurred";
};

export const signInUser = createAsyncThunk<
  SignInResponse,
  { email: string; password: string; rememberMe: boolean },
  { rejectValue: string }
>(
  "auth/signin",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, userId } = response.data;

      if (rememberMe) {
        Cookies.set("auth_token", accessToken, { expires: 30 });
        Cookies.set("userId", userId, { expires: 30 });
      } else {
        Cookies.set("auth_token", accessToken, { expires: 1 });
        Cookies.set("userId", userId, { expires: 1 });
      }

      return { ...response.data, rememberMe };
    } catch (error: any) {
      if (error.response && error.response.data) {
        const detailedMessage = extractErrorMessages(error.response.data);
        return rejectWithValue(detailedMessage);
      }
      return rejectWithValue(error.message || "Unexpected error occurred");
    }
  }
);

export const signUpUser = createAsyncThunk<
  SignInResponse,
  { email: string; password: string; rememberMe: boolean },
  { rejectValue: string }
>(
  "auth/signup",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
      });

      const { accessToken, userId } = response.data;

      if (rememberMe) {
        Cookies.set("auth_token", accessToken, { expires: 30 });
        Cookies.set("userId", userId, { expires: 30 });
      } else {
        Cookies.set("auth_token", accessToken, { expires: 1 });
        Cookies.set("userId", userId, { expires: 1 });
      }

      return { ...response.data, rememberMe };
    } catch (error: any) {
      if (error.response && error.response.data) {
        const detailedMessage = extractErrorMessages(error.response.data);
        return rejectWithValue(detailedMessage);
      }
      return rejectWithValue(error.message || "Unexpected error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      Cookies.remove("auth_token", { path: "" });
      Cookies.remove("userId", { path: "" });

      state.userId = "";
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = "";
    },
    clearError(state) {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(signInUser.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.isAuthenticated = true;
        state.error = "";
      })
      .addCase(signInUser.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Failed to sign in";
      })
      .addCase(signUpUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(signUpUser.fulfilled, (state: AuthState, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.isAuthenticated = true;
        state.error = "";
      })
      .addCase(signUpUser.rejected, (state: AuthState, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to sign up";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

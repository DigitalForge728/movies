import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import axiosInstance from "@/axios";

export interface Movie {
  year: string;
  title: string;
  poster: string;
  userId?: string;
  _id?: string;
}

interface MoviesState {
  movies: Movie[];
  total: number;
  page: number;
  limit: number;
  selectedMovie?: Movie;
  error?: string;
  isLoading: boolean;
}

const initialState: MoviesState = {
  movies: [],
  total: 0,
  page: 1,
  limit: 10,
  error: "",
  isLoading: false,
};

export const selectMovies = (state: RootState) => state.movie.movies;
export const selectActiveMovie = (state: RootState) =>
  state.movie.selectedMovie;
export const selectTotalMovies = (state: RootState) => state.movie.total;
export const selectPage = (state: RootState) => state.movie.page;
export const selectLimit = (state: RootState) => state.movie.limit;
export const selectIsLoading = (state: RootState) => state.movie.isLoading;
export const selectError = (state: RootState) => state.movie.error;

const extractErrorMessages = (errorData: any): string => {
  const { message, errors } = errorData;
  if (!errors) return message;

  const detailedMessages = Object.entries(errors)
    .map(([field, error]: [string, any]) => `${field}: ${error.message}`)
    .join("; ");

  return `${message}: ${detailedMessages}`;
};

export const getMovies = createAsyncThunk<
  { data: Movie[]; total: number; page: number; limit: number },
  void,
  { state: RootState; rejectValue: string }
>("movies/getMovies", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const { userId } = state.auth;
    const { page, limit } = state.movie;

    const response = await axiosInstance.get("/movies", {
      params: { userId, page, limit },
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const detailedMessage = extractErrorMessages(error.response.data);
      return rejectWithValue(detailedMessage);
    }
    return rejectWithValue(error.message || "Unexpected error occurred");
  }
});

export const getMovieById = createAsyncThunk<
  Movie,
  string,
  { rejectValue: string }
>("movies/getMovieById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/movies/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(extractErrorMessages(error.response.data));
    }
    return rejectWithValue(error.message || "Unexpected error occurred");
  }
});

export const updateMovie = createAsyncThunk<
  Movie,
  Movie,
  { rejectValue: string }
>("movies/updateMovie", async (movie, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/movies/${movie._id}`, movie, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(extractErrorMessages(error.response.data));
    }
    return rejectWithValue(error.message || "Unexpected error occurred");
  }
});

export const postMovie = createAsyncThunk<
  Movie,
  Movie,
  { state: RootState; rejectValue: string }
>("movies/postMovie", async (movie, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const { userId } = state.auth;

    const response = await axiosInstance.post(
      "/movies",
      { ...movie, userId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(extractErrorMessages(error.response.data));
    }
    return rejectWithValue(error.message || "Unexpected error occurred");
  }
});

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie | undefined>) => {
      state.selectedMovie = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
    setGlobalPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // getMovies
      .addCase(getMovies.pending, (state: MoviesState) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getMovies.fulfilled, (state: MoviesState, action) => {
        state.isLoading = false;
        state.movies = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getMovies.rejected, (state: MoviesState, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load movies";
      })
      .addCase(getMovieById.pending, (state: MoviesState) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getMovieById.fulfilled, (state: MoviesState, action) => {
        state.isLoading = false;
        const index = state.movies.findIndex(
          (movie) => movie._id === action.payload._id
        );
        if (index >= 0) {
          state.movies[index] = action.payload;
        } else {
          state.movies.push(action.payload);
        }
      })
      .addCase(getMovieById.rejected, (state: MoviesState, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load movie";
      })
      .addCase(updateMovie.pending, (state: MoviesState) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(updateMovie.fulfilled, (state: MoviesState, action) => {
        state.isLoading = false;
        const index = state.movies.findIndex(
          (movie) => movie._id === action.payload._id
        );
        if (index >= 0) {
          state.movies[index] = action.payload;
        }
      })
      .addCase(updateMovie.rejected, (state: MoviesState, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update movie";
      })
      .addCase(postMovie.pending, (state: MoviesState) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(postMovie.fulfilled, (state: MoviesState, action) => {
        state.isLoading = false;
        state.movies.push(action.payload);
      })
      .addCase(postMovie.rejected, (state: MoviesState, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to post movie";
      });
  },
});

export const { setSelectedMovie, clearError, setGlobalPage } =
  moviesSlice.actions;
export default moviesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../utils/api';

// Fetch all developer profiles (directory search with filter/sort params)
export const fetchProfiles = createAsyncThunk(
  'profiles/fetchProfiles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.skills) queryParams.append('skills', params.skills);
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/users?${queryString}` : '/users';
      
      const response = await apiFetch(endpoint);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single developer profile details by username
export const fetchProfileByUsername = createAsyncThunk(
  'profiles/fetchProfileByUsername',
  async (username, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/users/username/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profiles',
  initialState: {
    profiles: [],
    selectedProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profiles (Directory)
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single profile
      .addCase(fetchProfileByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfile = action.payload;
      })
      .addCase(fetchProfileByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProfile } = profileSlice.actions;
export default profileSlice.reducer;

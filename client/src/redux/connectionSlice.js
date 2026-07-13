import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../utils/api';

// Thunks
export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/connections');
      return response.data; // Expects { accepted, pendingIncoming, pendingOutgoing }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  'connections/sendConnectionRequest',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiFetch(`/connections/request/${userId}`, { method: 'POST' });
      dispatch(fetchConnections()); // Refresh lists
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  'connections/acceptConnectionRequest',
  async (connectionId, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiFetch(`/connections/accept/${connectionId}`, { method: 'PUT' });
      dispatch(fetchConnections()); // Refresh lists
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  'connections/rejectConnectionRequest',
  async (connectionId, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiFetch(`/connections/reject/${connectionId}`, { method: 'PUT' });
      dispatch(fetchConnections()); // Refresh lists
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeConnection = createAsyncThunk(
  'connections/removeConnection',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await apiFetch(`/connections/remove/${userId}`, { method: 'DELETE' });
      dispatch(fetchConnections()); // Refresh lists
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const connectionSlice = createSlice({
  name: 'connections',
  initialState: {
    accepted: [],
    pendingIncoming: [],
    pendingOutgoing: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.accepted = action.payload.accepted;
        state.pendingIncoming = action.payload.pendingIncoming;
        state.pendingOutgoing = action.payload.pendingOutgoing;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default connectionSlice.reducer;

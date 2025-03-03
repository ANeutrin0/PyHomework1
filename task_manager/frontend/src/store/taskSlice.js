import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 异步action：获取任务列表
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const response = await axios.get('/api/tasks');
    return response.data;
  }
);

// 异步action：创建任务
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    const response = await axios.post('/api/tasks', taskData);
    return response.data;
  }
);

// 异步action：更新任务
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }) => {
    const response = await axios.put(`/api/tasks/${taskId}`, taskData);
    return response.data;
  }
);

// 异步action：删除任务
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId) => {
    await axios.delete(`/api/tasks/${taskId}`);
    return taskId;
  }
);

// 异步action：归档任务
export const archiveTask = createAsyncThunk(
  'tasks/archiveTask',
  async (taskId) => {
    await axios.post(`/api/tasks/${taskId}/archive`);
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    filters: {
      status: 'all',
      priority: 'all',
      tags: [],
    },
    sortBy: 'dueDate',
    sortOrder: 'asc',
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取任务列表
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // 创建任务
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // 更新任务
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // 删除任务
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      })
      // 归档任务
      .addCase(archiveTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload);
        if (index !== -1) {
          state.items[index].status = 'ARCHIVED';
        }
      });
  },
});

export const { setFilters, setSortBy, setSortOrder } = taskSlice.actions;
export default taskSlice.reducer;
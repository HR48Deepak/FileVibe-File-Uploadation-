import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeader = () => ({
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

export const verifyToken = createAsyncThunk(
    'user/verifyToken',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue("No token");

            const response = await fetch('https://file-system-xi.vercel.app/api/token/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!response.ok) throw new Error("Invalid Token");
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchProfilePic = createAsyncThunk(
    'user/fetchProfilePic',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('https://file-system-xi.vercel.app/api/profile-picture', {
                responseType: 'blob',
                ...getAuthHeader()
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const uploadProfilePic = createAsyncThunk(
    'user/uploadProfilePic',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('picture', file);

            await axios.post("https://file-system-xi.vercel.app/api/profile-picture", formData, getAuthHeader());
    
            return URL.createObjectURL(file);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        fullname: localStorage.getItem('userName') || "",
        email: localStorage.getItem('userEmail') || "",
        profilePic: null,
        loading:false,
        status: 'idle'
    },
    // reducers: {
    //     logout: (state) => {
    //         state.fullname = "";
    //         state.email = "";
    //         state.profilePic = null;
    //         localStorage.clear();
    //     }
    // },
    reducers:{
        setloading:(state,action)=>{
            state.loading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(verifyToken.fulfilled, (state, action) => {
                state.fullname = action.payload.fullname || action.payload.name;
                state.email = action.payload.email;
                localStorage.setItem('userName', state.fullname);
                localStorage.setItem('userEmail', state.email);
            })

            .addCase(fetchProfilePic.fulfilled, (state, action) => {
                state.profilePic = action.payload;
            })
      
            .addCase(uploadProfilePic.fulfilled, (state, action) => {
                state.profilePic = action.payload;
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action)=>action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
                (state)=>{
                    state.loading = false
                }
            )
    }
});

// export const { logout } = userSlice.actions;
export const {setloading} = userSlice.actions;
export default userSlice.reducer;
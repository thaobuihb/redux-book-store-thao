import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../apiService";
import { fetchBooks } from "./bookAPI";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  readinglist: [],
  bookDetail: null,
  status: null,
};

// thêm 1 cuốn sách vào reading list
export const addReadingList = createAsyncThunk(
  "book/addReadingList",
  async (book) => {
    const response = await api.post(`/favorites`, book);
    return response.data;
  }
);

// lấy danh sách sách yêu thích từ API
export const getReadingList = createAsyncThunk(
  "book/getReadingList",
  async () => {
    const response = await api.get(`/favorites`);
    return response.data;
  }
);

// lấy chi tiết của một cuốn sách cụ thể dựa trên bookId.
export const getBookDetail = createAsyncThunk(
  "book/getBookDetail",
  async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }
);

// Xoá 1 book khỏi reading list
export const removeBook = createAsyncThunk(
  "book/removeBook",
  async (removedBookId, thunkAPI) => {
    const response = await api.delete(`/favorites/${removedBookId}`);
    thunkAPI.dispatch(getReadingList()); // Fetch updated reading list after removal
    return response.data;
  }
);

// lấy dữ liệu book từ fetchBooks
export const fetchData = createAsyncThunk("book/fetchData", async (props) => {
  const response = await fetchBooks(props);
  return response.data;
});

const bookSlice = createSlice({
  name: "book",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading"; // cập nhật trạng thái loading
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        // cập nhật trạng thái và dữ liệu sách khi hành động thành công
        state.status = null;
        state.books = action.payload;
      })
      .addCase(fetchData.rejected, (state) => {
        // cập nhật trạng thái khi lấy data không thành công
        state.status = "Failed to fetch data";
      });

    // Xử lý trạng thái thành công và thất bại của hành động addReadingList, hiển thị thông báo
    builder
      .addCase(addReadingList.fulfilled, (state, action) => {
        console.log(action.payload);
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addReadingList.rejected, () => {
        toast.error("Cannot proceed. The book has already been added!");
      });

    // Xử lý trạng thái cho hành động getReadingList
    builder
      .addCase(getReadingList.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getReadingList.fulfilled, (state, action) => {
        state.status = null;
        state.readinglist = action.payload;
      })
      .addCase(getReadingList.rejected, (state) => {
        state.status = "Failed to get reading list";
      });

    // Xử lý trạng thái khi xoá một cuốn sách khỏi reading list
    builder
      .addCase(removeBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.status = null;
        // Remove the book from reading list state
        state.readinglist = state.readinglist.filter(
          (book) => book.id !== action.meta.arg
        );
        toast.success("The book has been removed");
      })
      .addCase(removeBook.rejected, () => {
        toast.error("Failed to remove book");
      });

    // Xử lý trạng thái cho hành động lấy chi tiết sách
    builder
      .addCase(getBookDetail.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getBookDetail.fulfilled, (state, action) => {
        state.status = null;
        state.bookDetail = action.payload;
      })
      .addCase(getBookDetail.rejected, (state) => {
        state.status = "Failed to get book details";
      });
  },
});

export default bookSlice.reducer;

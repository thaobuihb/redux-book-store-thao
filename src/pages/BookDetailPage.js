import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "../apiService";
import { Container, Button, Box, Grid, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addReadingList, getBookDetail } from "../components/book/bookSlice";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const BookDetailPage = () => {
  const dispatch = useDispatch();
  const bookDetail = useSelector((state) => state.book.bookDetail);
  const status = useSelector((state) => state.book.status);

  const params = useParams();
  const bookId = params.id;

  useEffect(() => {
    dispatch(getBookDetail(bookId));
  }, [dispatch, bookId]);

  // const [loading, setLoading] = useState(false);
  // const [book, setBook] = useState(null);
  // const [addingBook, setAddingBook] = useState(false);
  // const params = useParams();
  // const bookId = params.id;

  // const addToReadingList = (book) => {
  //   setAddingBook(book);
  // };

  // useEffect(() => {
  //   const postData = async () => {
  //     if (!addingBook) return;
  //     setLoading(true);
  //     try {
  //       await api.post(`/favorites`, addingBook);
  //       toast.success("The book has been added to the reading list!");
  //     } catch (error) {
  //       toast.error(error.message);
  //       console.log(error);
  //     }
  //     setLoading(false);
  //   };
  //   postData();
  // }, [addingBook]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await api.get(`/books/${bookId}`);
  //       setBook(res.data);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, [bookId]);

  return (
    <Container>
      {status ? (
        <Box sx={{ textAlign: "center", color: "primary.main" }}>
          <ClipLoader color="#inherit" size={150} loading={true} />
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          p={4}
          mt={5}
          sx={{ border: "1px solid black" }}
        >
          <Grid item md={4}>
            {bookDetail && (
              <img
                width="100%"
                src={`${BACKEND_API}/${bookDetail.imageLink}`}
                alt=""
              />
            )}
          </Grid>
          <Grid item md={8}>
            {bookDetail && (
              <Stack>
                <h2>{bookDetail.title}</h2>
                <Typography variant="body1">
                  <strong>Author:</strong> {bookDetail.author}
                </Typography>
                <Typography variant="body1">
                  <strong>Year:</strong> {bookDetail.year}
                </Typography>
                <Typography variant="body1">
                  <strong>Country:</strong> {bookDetail.country}
                </Typography>
                <Typography variant="body1">
                  <strong>Pages:</strong> {bookDetail.pages}
                </Typography>
                <Typography variant="body1">
                  <strong>Language:</strong> {bookDetail.language}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ width: "fit-content" }}
                  onClick={() => dispatch(addReadingList(bookDetail))}
                >
                  Add to Reading List
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default BookDetailPage;

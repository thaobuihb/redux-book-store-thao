import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Box,
  Card,
  Stack,
  CardMedia,
  CardActionArea,
  Typography,
  CardContent,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getReadingList, removeBook } from "../components/book/bookSlice";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const ReadingPage = () => {
  const dispatch = useDispatch();
  const readinglist = useSelector((state) => state.book.readinglist);
  const status = useSelector((state) => state.book.status);
  const [removedBookId, setRemovedBookId] = useState("");
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const navigate = useNavigate();

  const handleClickBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const chooseRemoveBook = (bookId) => {
    setRemovedBookId(bookId);
  };

  useEffect(() => {
    dispatch(getReadingList());
  }, [dispatch]);

  useEffect(() => {
    if (removedBookId) {
      dispatch(removeBook(removedBookId)).then(() => {
        setRemovedBookId("");
      });
    }
  }, [dispatch, removedBookId]);

  useEffect(() => {
    if (readinglist.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyMessage(true);
      }, 1000);
      return () => clearTimeout(timer); // Clear the timer if the component unmounts or if readinglist changes
    } else {
      setShowEmptyMessage(false);
    }
  }, [readinglist]);

  return (
    <Container>
      <Typography variant="h3" sx={{ textAlign: "center" }} m={3}>
        Reading List
      </Typography>
      {status === "loading" ? (
        <Box sx={{ textAlign: "center", color: "primary.main" }}>
          <ClipLoader color="inherit" size={150} loading={true} />
        </Box>
      ) : showEmptyMessage ? (
        <Typography variant="h5" sx={{ textAlign: "center" }} m={3}>
There is no book you are reading. Please add it here!
        </Typography>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-around"
          flexWrap={"wrap"}
        >
          {readinglist.map((book) => (
            <Card
              key={book.id}
              sx={{
                width: "12rem",
                height: "27rem",
                marginBottom: "2rem",
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`${BACKEND_API}/${book.imageLink}`}
                  alt={`${book.title}`}
                  onClick={() => handleClickBook(book.id)}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {`${book.title}`}
                  </Typography>
                  <Typography gutterBottom variant="body1" component="div">
                    {`${book.author}`}
                  </Typography>
                  <Button
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "secondary.light",
                      color: "secondary.contrastText",
                      padding: "0",
                      minWidth: "1.5rem",
                    }}
                    size="small"
                    onClick={() => chooseRemoveBook(book.id)}
                  >
                    &times;
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ReadingPage;

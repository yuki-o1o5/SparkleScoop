import { Modal, Rating, Typography } from "@mui/material";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";
import { UserContext } from "../contexts/UserContext";
import Footer from "../components/Footer";
import { OutlinedButton } from "../components/OutlinedButton";

export const ProductPage = () => {
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  let { id } = useParams();
  const productId = id;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsDataById(productId);
    fetchAllReviews(productId);
  }, [productId]);

  const fetchProductsDataById = async (productId) => {
    const res = await fetch(
      `https://makeup-api.herokuapp.com/api/v1/products/${productId}.json`
    );
    const data = await res.json();
    setProduct(data);
  };

  const fetchAllReviews = async (productId) => {
    const res = await fetch(`/api/reviews/${productId}`);
    const data = await res.json();
    setReviews(data);
  };

  const average =
    reviews.reduce((accum, curr) => accum + curr.score, 0) / reviews.length;

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleGotoLogin = () => navigate("/login");

  return (
    <>
      <PageContainer>
        <ProductContainer>
          <ImageContainer>
            <img src={product.image_link} alt={product.name} />
          </ImageContainer>
          <TextsContainer>
            <Typography gutterBottom variant="h6" component="div">
              {product.name}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {product.price}
            </Typography>
            <ReviewContainer>
              <ReviewNumber gutterBottom variant="h6" component="div">
                {average ? `${average}` : `0 review`}
              </ReviewNumber>
              <Rating name="read-only" value={average || 0} readOnly />
            </ReviewContainer>
            <Typography gutterBottom component="div">
              {product.description}
            </Typography>
            <ButtonContainer>
              {!user ? (
                <OutlinedButton onClick={handleGotoLogin}>
                  Create Review
                </OutlinedButton>
              ) : !reviews.find((review) => review.user === user) ? (
                <OutlinedButton onClick={handleOpenModal}>
                  Create Review
                </OutlinedButton>
              ) : null}
            </ButtonContainer>
          </TextsContainer>
        </ProductContainer>
        <AllReviewsWrapper>
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            disableEnforceFocus
          >
            <>
              <ReviewForm
                productId={productId}
                editMode={false}
                fetchAllReviews={fetchAllReviews}
              />
            </>
          </Modal>
          {reviews.map((item, index) => (
            <ReviewCard
              id={item._id}
              userName={item.user}
              title={item.title}
              review={item.review}
              score={item.score}
              date={item.date}
              key={index}
              productId={productId}
              fetchAllReviews={fetchAllReviews}
            />
          ))}
        </AllReviewsWrapper>
      </PageContainer>
      <Footer />
    </>
  );
};

const PageContainer = styled.div`
  padding: 0px 20px;
  @media (min-width: 768px) {
    padding: 0px 170px 50px;
  }
`;

const ProductContainer = styled.div`
  height: 100%;
  gap: 30px;
  @media (min-width: 768px) {
    display: flex;
    width: 100%;
    margin: 50px 0 50px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
  margin: 50px 0 50px;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const TextsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 50px 0 50px;
  @media (min-width: 768px) {
    width: 50%;
  }
`;

const ReviewNumber = styled(Typography)`
  margin-right: 10px;
`;

const ReviewContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AllReviewsWrapper = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
`;

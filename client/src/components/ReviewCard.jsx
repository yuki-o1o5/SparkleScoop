import PropTypes from "prop-types";
import { Modal, Rating, Typography } from "@mui/material";
import styled from "styled-components";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { ReviewForm } from "./ReviewForm";
import ContainedButton from "./ContainedButton";

export const ReviewCard = ({
  id,
  userName,
  title,
  review,
  score,
  date,
  productId,
  fetchAllReviews,
}) => {
  const { user } = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemoveReview = async () => {
    const response = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchAllReviews(productId);
    } else {
      console.error("Error:", response.statusText);
    }
  };

  const modifiedDate = date.slice(0, 10);

  return (
    <ReviewCardWrapper>
      <SubWrapper>
        <Title>{title}</Title>
        <Rating name="read-only" value={score} readOnly />
      </SubWrapper>
      <Description color="text.secondary">{review}</Description>
      <CardBottomWrapper>
        <SubWrapper>
          <UserName color="text.secondary">by {userName}</UserName>
          <Date color="text.secondary">{modifiedDate}</Date>
        </SubWrapper>
        <Modal open={modalOpen} onClose={handleCloseModal} disableEnforceFocus>
          <>
            <ReviewForm
              productId={productId}
              editMode={true}
              reviewId={id}
              name={userName}
              originalReview={{ title, review, score, date }}
              fetchAllReviews={fetchAllReviews}
            />
          </>
        </Modal>
        <ButtonContainer>
          {userName === user ? (
            <ContainedButton size="small" onClick={handleOpenModal}>
              edit
            </ContainedButton>
          ) : (
            ""
          )}
          {userName === user ? (
            <ContainedButton size="small" onClick={handleRemoveReview}>
              remove
            </ContainedButton>
          ) : (
            ""
          )}
        </ButtonContainer>
      </CardBottomWrapper>
    </ReviewCardWrapper>
  );
};

ReviewCard.propTypes = {
  id: PropTypes.string,
  userName: PropTypes.string,
  title: PropTypes.string,
  review: PropTypes.string,
  score: PropTypes.number,
  date: PropTypes.string,
  productId: PropTypes.string,
  fetchAllReviews: PropTypes.func,
};

const ReviewCardWrapper = styled.div`
  width: 100%;
  margin-bottom: 60px;
  border-bottom: 1px solid ${(props) => props.theme.palette.custom.light};
  @media (min-width: 768px) {
    width: 70%;
  }
`;

const SubWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Title = styled(Typography)`
  font-size: 1.2rem;
`;

const Description = styled(Typography)`
  margin-top: 0.5rem;
  width: 100%;
`;

const UserName = styled(Typography)`
  font-size: 0.8rem;
`;

const Date = styled(Typography)`
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const CardBottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;

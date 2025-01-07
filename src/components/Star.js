import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import styled from "styled-components";
const Star = ({ rating }) => {
  const ratingStar = Array.from({ length: 5 }, (elem, index) => {
    let number = index + 0.5;
    return (
      <span key={index}>
        {rating >= index + 1 ? (
          <FaStar className="icon" />
        ) : rating >= number ? (
          <FaStarHalfAlt className="icon" />
        ) : (
          <AiOutlineStar className="icon" />
        )}
      </span>
    );
  });
  const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
      color: gold; /* Change star color */
      font-size: 1.2rem; /* Adjust size */
      margin: 0 2px; /* Spacing between stars */
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.2); /* Scale on hover for effect */
      }
    }
  `;
  return (
    <Wrapper>
      <div className="flex justify-center items-center">{ratingStar}</div>
    </Wrapper>
  );
};

export default Star;

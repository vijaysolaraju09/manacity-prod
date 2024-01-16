import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ResponsiveCarousel = () => {
  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      autoPlay
      infiniteLoop
      interval={5000}
      emulateTouch
      swipeable
    >
      <div className="carousel-item">
        <img src="https://placekitten.com/800/400" alt="Slide 1" />
      </div>
      <div className="carousel-item">
        <img src="https://placekitten.com/800/401" alt="Slide 2" />
      </div>
      <div className="carousel-item">
        <img src="https://placekitten.com/800/402" alt="Slide 3" />
      </div>
    </Carousel>
  );
};

export default ResponsiveCarousel;

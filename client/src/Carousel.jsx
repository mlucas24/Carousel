import React from 'react';
import T from 'prop-types';
import ENV from './config';
import Item from './Item';

const Carousel = ({
  items, position, onItemClick, title, onArrowClick, carousel, smallWindow, onCarouselScroll,
}) => (
  <>
    <div className="g-carousel-title">{title}</div>
    <div data-position={position} className="g-carousel-container" data-type={carousel}>
      {!smallWindow ? (
        <button type="button" className="g-btn g-arrow-holder" disabled={position === 0} data-dir="-1" onClick={onArrowClick}>
          <div className="g-arrow g-left" />
          <div className="g-arrow-fill" />
        </button>
      ) : ''}
      <div
        className="g-item-slider-outer"
        onScroll={onCarouselScroll}
        style={smallWindow ? { overflowX: 'scroll', left: 0 } : { overflowX: 'hidden' }}
      >
        <div
          className="g-item-slider"
          style={{
            width: `${(items.length / 4) * 100}%`,
          }}
        >
          {items.map((item) => <Item key={item.id} item={item} containerWidth={(items.length / 4) * 100} onItemClick={onItemClick} />)}
        </div>
      </div>
      {!smallWindow ? (
        <button type="button" className="g-btn g-arrow-holder" disabled={position === -items.length + 4} data-dir="1" onClick={onArrowClick}>
          <div className="g-arrow g-right" />
          <div className="g-arrow-fill" />
        </button>
      ) : ''}
    </div>
  </>
);

Carousel.propTypes = {
  items: T.arrayOf(T.shape(ENV.productSchema)).isRequired,
  position: T.number.isRequired,
  onItemClick: T.func.isRequired,
  title: T.string.isRequired,
  onArrowClick: T.func.isRequired,
  carousel: T.string.isRequired,
  smallWindow: T.bool.isRequired,
  onCarouselScroll: T.func.isRequired,
  scrollPosition: T.number.isRequired,
};

export default Carousel;

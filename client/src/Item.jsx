import React from 'react';
import T from 'prop-types';
import ENV from './config';

const Item = ({ item, onItemClick, containerWidth }) => (
  <button type="button" className="g-btn g-item-container" style={{ padding: `0 ${(100 / containerWidth) * 2}%` }} data-id={item.id} onClick={onItemClick}>
    <div className="g-item-image-holder">
      <img className="g-item-image" src={ENV.imageURL + item.image} alt={item.name} />
    </div>
    {item.isNewItem ? <div className="g-new-item">New</div> : ''}
    {item.isFamilyPriced ? <div className="g-item-fam-price">IKEA Family Price</div> : ''}
    <div className="g-item-name">{item.name}</div>
    <div className="g-item-desc">{item.description}</div>
    <div className={`g-item-price${item.isOnSale ? ' g-item-sale' : ''}`}>{`$${item.price.toFixed(2)}`}</div>
    <div className="g-item-stars">
      <div className="g-item-empty-stars">&nbsp;</div>
      <div className="g-item-full-stars" style={{ width: `${(item.rating / 5) * 100}%` }}>&nbsp;</div>
    </div>
    <div className="g-item-rating">{`${item.rating.toFixed(1)} (${item.reviews})`}</div>
    {item.hasOptions ? <div className="g-item-more">More options available</div> : ''}
  </button>
);

Item.propTypes = {
  item: T.shape(ENV.productSchema).isRequired,
  onItemClick: T.func.isRequired,
  containerWidth: T.number.isRequired,
};

export default Item;

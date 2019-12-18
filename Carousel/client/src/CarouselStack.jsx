/* eslint-disable object-curly-newline */
/* eslint-env browser */
import React from 'react';
import Axios from 'axios';
import Carousel from './Carousel';
import ENV from './config';

export default class CarouselStack extends React.Component {
  constructor() {
    super();

    this.state = {
      productId: 3,
      looseItems: [],
      loosePosition: 0,
      looseRelPos: 0,
      looseScrollPos: 0,
      closeItems: [],
      closePosition: 0,
      closeRelPos: 0,
      closeScrollPos: 0,
      carouselWidth: 0,
      smallWindow: window.innerWidth < 1048,
    };

    this.canSlideCarousel = true;

    this.itemClicked = (event) => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.changeProduct(event.currentTarget.dataset.id);
      const reset = {
        currentTarget: event.currentTarget.parentNode.parentNode.parentNode.childNodes[0],
      };
      reset.currentTarget.dataset.dir = -4;
      this.carouselShift(reset);
    };

    this.changeProduct = (productId) => {
      window.dispatchEvent(new CustomEvent('productChanged', {
        bubbles: true,
        detail: {
          productId,
        },
      }));
      this.setState({
        productId,
      }, () => {
        this.getRelatedItems();
      });
    };

    this.carouselShift = (event) => {
      if (!this.canSlideCarousel) return;

      const { type, outerSlider, button, oldPosition, oldRelative, innerSlider, items } = this.getSlideVariables(event);
      const { newPosition, newRelative } = this.calculateNewPosition({ button, items, oldPosition });

      this.animateCarousel({ type, innerSlider, oldRelative, newRelative });

      const scrollPercent = this.calculateScrollPercent({ items, newPosition });
      const newScrollPos = scrollPercent * (innerSlider.clientWidth - outerSlider.clientWidth);

      this.setState({
        [`${type}Position`]: newPosition,
        [`${type}RelPos`]: newRelative,
        [`${type}ScrollPos`]: newScrollPos,
      });
    };

    this.getSlideVariables = (event) => {
      const { state } = this;
      const button = event.currentTarget;
      const carousel = button.parentNode;
      const { type } = button.parentNode.dataset;
      const oldPosition = state[`${type}Position`];
      const items = state[`${type}Items`];
      const oldRelative = state[`${type}RelPos`];
      const outerSlider = carousel.childNodes[1];
      const innerSlider = outerSlider.childNodes[0];
      return {
        type, outerSlider, button, oldPosition, oldRelative, innerSlider, items,
      };
    };

    this.calculateNewPosition = ({
      button, items, oldPosition,
    }) => {
      const direction = button.dataset.dir;
      const indexDelta = 4 * direction;
      const minIndex = this.getMinIndex(items);
      const newPosition = Math.min(Math.max(oldPosition - indexDelta, minIndex), 0);
      const newRelative = newPosition * 25;
      return { newPosition, newRelative };
    };

    this.animateCarousel = ({
      type, innerSlider, oldRelative, newRelative,
    }) => {
      this.canSlideCarousel = false;
      innerSlider.classList.remove(`g-animate-${type}`);
      (() => innerSlider.offsetWidth)();
      const sheet = document.styleSheets[this.animationSheetIndex];
      let i = 0;
      for (i; i < sheet.rules.length; i += 1) {
        if (sheet.rules[i].name === `g-carousel-slide-${type}`) {
          sheet.deleteRule(i);
        }
      }
      sheet.insertRule(`
        @keyframes g-carousel-slide-${type} {
          from {left: ${oldRelative}%}
          to {left: ${newRelative}%}
        }
      `);
      innerSlider.classList.add(`g-animate-${type}`);
      setTimeout(() => { this.canSlideCarousel = true; }, 600);
    };

    this.onWindowResize = () => {
      this.setState({
        smallWindow: window.innerWidth < 1048,
      });
    };

    // this.calculateSnapPosition = () => {

    // };

    this.calculateScrollPercent = ({ items, newPosition }) => {
      const indexSpan = Math.abs(this.getMinIndex(items));
      const scrollPercent = Math.abs(newPosition) / indexSpan;
      return scrollPercent;
    };

    this.onCarouselScroll = (e) => {
      const outer = e.currentTarget;
      const scrollPercent = outer.scrollLeft / (outer.scrollWidth - outer.clientWidth);
      const { type } = e.currentTarget.parentNode.dataset;
      const scrollPos = `${type}ScrollPos`;
      this.setState({
        [scrollPos]: scrollPercent,
      });
    };

    this.updateReviews = ({ id, newRating }) => {
      const rating = typeof newRating !== 'number' ? 0 : newRating;
      const review = { id, rating };
      Axios.patch('/reviews/update', review, { baseURL: `http://${ENV.serverHosted}` })
        .catch((err) => {
          console.log(err);
        });
    };

    this.getMinIndex = (items) => -items.length + 4;
  }

  componentDidMount() {
    this.getRelatedItems();
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('productChanged', (event) => {
      this.setState({
        id: event.detail.productId,
      }, () => {
        this.getRelatedItems();
      });
    });
    window.addEventListener('newReview', (event) => {
      this.updateReviews(event.detail);
    });
    this.sheetNumber = document.styleSheets.length;
    this.animationSheetIndex = document.styleSheets.length;
    this.animationSheet = document.createElement('style');
    document.head.appendChild(this.animationSheet);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  getRelatedItems() {
    const { productId: id } = this.state;
    Axios.all([
      Axios.get('/related/close', { baseURL: `http://${ENV.serverHosted}/products/${id}` }),
      Axios.get('/related/loose', { baseURL: `http://${ENV.serverHosted}/products/${id}` }),
    ])
      .then((docsList) => {
        this.setState({
          closeItems: docsList[0].data,
          closePosition: 0,
          looseItems: docsList[1].data,
          loosePosition: 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      looseItems, loosePosition, looseScrollPos, closeItems, closePosition, closeScrollPos, smallWindow, 
    } = this.state;
    return (
      <>
        <Carousel
          carousel="close"
          items={closeItems}
          position={closePosition}
          onItemClick={this.itemClicked}
          onArrowClick={this.carouselShift}
          smallWindow={smallWindow}
          onCarouselScroll={this.onCarouselScroll}
          scrollPosition={closeScrollPos}
          title="Similar products"
        />
        <Carousel
          carousel="loose"
          items={looseItems}
          position={loosePosition}
          onItemClick={this.itemClicked}
          onArrowClick={this.carouselShift}
          smallWindow={smallWindow}
          onCarouselScroll={this.onCarouselScroll}
          scrollPosition={looseScrollPos}
          title="You might also like"
        />
      </>
    );
  }
}

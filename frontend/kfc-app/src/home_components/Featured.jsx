import React from "react";
import Slider from "react-slick";
import styles from "./HomeSlider.module.css";
import SliderData from "../SliderData.json";
import ProductImage from "../utils/productImage";

export default class Featured extends React.Component {
  state = {
    slideIndex: 0,
    updateCount: 0,
  };

  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,

      responsive: [
        {
          breakpoint: 1279,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],

      afterChange: (current) => {
        this.setState((previousState) => ({
          slideIndex: current,
          updateCount: previousState.updateCount + 1,
        }));
      },
    };

    return (
      <div className={styles.commonSliderDiv}>
        <div
          className={styles.commonSliderHeading}
          style={{ textAlign: "center" }}
        >
          <h2>FEATURED ITEMS</h2>
        </div>

        <Slider {...settings}>
          {SliderData.featured.map((item, index) => (
            <div
              className={styles.itemDiv}
              style={{ outline: "none" }}
              key={item.title || index}
            >
              <div className={styles.imageFrame}>
                <ProductImage
                  src={item.image}
                  title={item.title}
                  alt={item.title}
                  className={styles.itemImg}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";

                    const placeholder =
                      event.currentTarget.nextElementSibling;

                    if (placeholder) {
                      placeholder.style.display = "flex";
                    }
                  }}
                />

                <div
                  className={styles.imagePlaceholder}
                  style={{ display: "none" }}
                >
                  Food image coming soon
                </div>
              </div>

              <p className={styles.itemTitle}>{item.title}</p>

              <p className={styles.itemPrice}>{item.price}</p>

              <p className={styles.itemDesc}>{item.desc}</p>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
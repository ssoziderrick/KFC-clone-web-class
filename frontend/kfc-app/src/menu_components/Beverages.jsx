import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Beverages = () => {
    // Get existing frontend data and select beverage products.
    const beverages = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "beverages");

    // Remove duplicate products.
    const uniqueBeverages = beverages.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="beverage">
            <h1>BEVERAGES</h1>

            <div className={styles.itembox}>
                {uniqueBeverages.length > 0 ? (
                    uniqueBeverages.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No beverages found.</p>
                )}
            </div>
        </div>
    );
};

export default Beverages;

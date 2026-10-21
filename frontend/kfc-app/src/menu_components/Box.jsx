import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Box = () => {
    // Get existing frontend data and select box meal products.
    const boxMeals = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "boxmeals");

    // Remove duplicate products.
    const uniqueBoxMeals = boxMeals.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="box">
            <h1>BOX MEALS</h1>

            <div className={styles.itembox}>
                {uniqueBoxMeals.length > 0 ? (
                    uniqueBoxMeals.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No box meals found.</p>
                )}
            </div>
        </div>
    );
};

export default Box;
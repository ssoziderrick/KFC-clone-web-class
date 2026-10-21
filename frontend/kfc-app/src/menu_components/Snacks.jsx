
import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Snacks = () => {
    // Get existing frontend data and select snack products.
    const snacks = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "snacks");

    // Remove duplicate products.
    const uniqueSnacks = snacks.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="snacks">
            <h1>SNACKS</h1>

            <div className={styles.itembox}>
                {uniqueSnacks.length > 0 ? (
                    uniqueSnacks.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No snacks found.</p>
                )}
            </div>
        </div>
    );
};

export default Snacks;

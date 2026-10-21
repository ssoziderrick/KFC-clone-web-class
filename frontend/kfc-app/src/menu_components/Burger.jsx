import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Burger = () => {
    // Get existing frontend data and select burger products.
    const burgers = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "burger");

    // Remove duplicate products.
    const uniqueBurgers = burgers.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="burger">
            <h1>BURGERS</h1>

            <div className={styles.itembox}>
                {uniqueBurgers.length > 0 ? (
                    uniqueBurgers.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No burgers found.</p>
                )}
            </div>
        </div>
    );
};

export default Burger;

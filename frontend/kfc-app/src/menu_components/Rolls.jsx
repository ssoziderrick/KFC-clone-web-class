import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Rolls = () => {
    // Get existing frontend data and select chicken rolls.
    const rolls = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "rolls");

    // Remove duplicate products.
    const uniqueRolls = rolls.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="rolls">
            <h1>CHICKEN ROLLS</h1>

            <div className={styles.itembox}>
                {uniqueRolls.length > 0 ? (
                    uniqueRolls.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No chicken rolls found.</p>
                )}
            </div>
        </div>
    );
};

export default Rolls;

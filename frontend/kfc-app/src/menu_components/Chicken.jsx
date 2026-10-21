import React from "react";
import { useNavigate } from "react-router-dom";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Chicken = () => {
    const navigate = useNavigate();

    // Get the existing frontend data and select chicken products.
    const chicken = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "chicken");

    // Remove duplicate products.
    const uniqueChicken = chicken.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="chicken">
            <h1>CHICKEN BUCKETS</h1>

            <div className={styles.itembox}>
                {uniqueChicken.length > 0 ? (
                    uniqueChicken.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No chicken products found.</p>
                )}
            </div>
        </div>
    );
};

export default Chicken;
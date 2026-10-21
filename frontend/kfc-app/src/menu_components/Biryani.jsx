import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const Biryani = () => {
    // Get existing frontend data and select biryani products.
    const biryani = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "biryani");

    // Remove duplicate products.
    const uniqueBiryani = biryani.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="biryani">
            <h1>BIRYANI BUCKETS</h1>

            <div className={styles.itembox}>
                {uniqueBiryani.length > 0 ? (
                    uniqueBiryani.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No biryani products found.</p>
                )}
            </div>
        </div>
    );
};

export default Biryani;

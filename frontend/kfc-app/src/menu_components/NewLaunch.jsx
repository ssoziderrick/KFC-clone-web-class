import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const NewLaunch = () => {
    // Get existing frontend data and select new launch products.
    const launchItems = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "launch");

    // Remove duplicate products.
    const uniqueLaunchItems = launchItems.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="launch">
            <h1>NEW LAUNCH</h1>

            <div className={styles.itembox}>
                {uniqueLaunchItems.length > 0 ? (
                    uniqueLaunchItems.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No new launch products found.</p>
                )}
            </div>
        </div>
    );
};

export default NewLaunch;
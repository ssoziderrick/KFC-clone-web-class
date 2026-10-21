
import React from "react";
import SliderData from "../SliderData.json";
import Item from "./Item";
import styles from "./item.module.css";

const StayHome = () => {
    // Get existing frontend data and select stay-home specials.
    const stayHomeItems = [
        ...SliderData.featured,
        ...SliderData.favorites,
        ...SliderData.quickbites
    ].filter((item) => item.type === "stayhome");

    // Remove duplicate products.
    const uniqueStayHomeItems = stayHomeItems.filter(
        (item, index, self) =>
            index === self.findIndex(
                (product) => product.title === item.title
            )
    );

    return (
        <div id="stayhome">
            <h1>STAY HOME SPECIALS</h1>

            <div className={styles.itembox}>
                {uniqueStayHomeItems.length > 0 ? (
                    uniqueStayHomeItems.map((item, index) => (
                        <Item
                            key={item._id || item.id || item.title || index}
                            {...item}
                        />
                    ))
                ) : (
                    <p>No stay-home specials found.</p>
                )}
            </div>
        </div>
    );
};

export default StayHome;
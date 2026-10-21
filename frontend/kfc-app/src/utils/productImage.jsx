import React from "react";

const productImageAssets = {
  "bucket-for-two.png": require("../assets/png/bucket-for-two.png"),
  "chicken-roll.png": require("../assets/png/chicken-roll.png"),
  "chickn-wings-combo.png": require("../assets/png/chickn-wings-combo.png"),
  "choco-mud-pie.png": require("../assets/png/choco-mud-pie.png"),
  "classic-biryani-combo.png": require("../assets/png/classic-biryani-combo.png"),
  "classic-chicken-biryani-bucket.png": require("../assets/png/classic-chicken-biryani-bucket.png"),
  "classic-zinger-burger.png": require("../assets/png/classic-zinger-burger.png"),
  "double-chicken-roll.png": require("../assets/png/double-chicken-roll.png"),
  "family-feast.png": require("../assets/png/family-feast.png"),
  "large-fries.png": require("../assets/png/large-fries.png"),
  "large-popcorn.png": require("../assets/png/large-popcorn.png"),
  "mingles-bucket-meal.png": require("../assets/png/mingles-bucket-meal.png"),
  "mixed-zinger-doubles.png": require("../assets/png/mixed-zinger-doubles.png"),
  "nashville-strips.png": require("../assets/png/nashville-strips.png"),
  "pepsi-black-can-330ml.png": require("../assets/png/pepsi-black-can-330ml.png"),
  "regular-popcorn.png": require("../assets/png/regular-popcorn.png"),
  "single-roll-combo.png": require("../assets/png/single-roll-combo.png"),
  "single-smoky-red-chicken.png": require("../assets/png/single-smoky-red-chicken.png"),
  "smoky-red-chicken.png": require("../assets/png/smoky-red-chicken.png"),
  "two-veg-krispers.png": require("../assets/png/two-veg-krispers.png"),
  "zinger-box.png": require("../assets/png/zinger-box.png"),
};

export function resolveProductImage(image) {
  if (!image) return "/images/food-placeholder.svg";
  if (/^https?:\/\//.test(image)) return image;

  try {
    return productImageAssets[image] || "/images/food-placeholder.svg";
  } catch {
    return "/images/food-placeholder.svg";
  }
}

export default function ProductImage({
  src,
  alt,
  title,
  onAddToCart,
  ...props
}) {
  const handleImageError = (event) => {
    console.error("Unable to load product image:", title, src);

    event.currentTarget.style.display = "none";

    const placeholder = event.currentTarget.nextElementSibling;

    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  return (
    <div className="product-image-container">
      <img
        {...props}
        src={resolveProductImage(src)}
        alt={alt || title || "KFC menu item"}
        title={title}
        onError={handleImageError}
      />

      <div
        style={{
          display: "none",
          minHeight: "120px",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          color: "#666",
        }}
      >
        Image unavailable
      </div>

      {onAddToCart && (
        <button
          type="button"
          onClick={onAddToCart}
          style={{
            marginTop: "10px",
            padding: "10px 18px",
            backgroundColor: "#e4002b",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ADD TO CART
        </button>
      )}
    </div>
  );
}
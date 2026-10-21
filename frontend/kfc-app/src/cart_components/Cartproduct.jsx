import api from "../utils/api";
import React from 'react'
import { useState } from 'react'
import styles from "./cart.module.css"
import { useDispatch } from 'react-redux'
import { addcartcount, deleteCart } from '../redux/action'
import { resolveProductImage } from "../utils/productImage";

const Cartproduct = ({desc,id,image,price,qty,title,_id, fetchData}) => {
const dispatch= useDispatch();
const [updating, setUpdating] = useState(false);
let acprice = Number(String(price).replace(/[^\d.-]/g, ""));

const handleRemove = async () => {
  if (updating) return;
  setUpdating(true);
  try {
    await api.delete(`/api/productcart/cart/${id}`);
    dispatch(deleteCart(id));
    if (fetchData) await fetchData();
  } catch (error) {
    console.error("Could not remove cart item:", error);
    alert(error.response?.data?.message || "Could not remove this item. Please try again.");
  } finally {
    setUpdating(false);
  }
}

const handleQuantityChange = async (nextQty) => {
  if (updating || nextQty < 1) return;

  setUpdating(true);
  try {
    const { data } = await api.put(`/api/productcart/cart/${id}`, { qty: nextQty });
    dispatch(addcartcount(data.product));
  } catch (error) {
    console.error("Could not update cart quantity:", error);
    alert(error.response?.data?.message || "Could not update the quantity. Please try again.");
  } finally {
    setUpdating(false);
  }
}

  return (
    <div className={styles.cartproductmain} >
        <div className={styles.cartproductleft}>
            <img src={resolveProductImage(image)} alt={title || "food"} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/food-placeholder.svg"; }} />
            <div>
                <h3>{title}</h3>
                <ul>
                    <li>{desc}</li>
                </ul>
                <h3
                style={{cursor:'pointer'}}
                onClick={handleRemove}
                >Remove</h3>
            </div>
        </div>
        <div className={styles.cartproductright} >
            
                <button disabled={updating || qty <= 1} onClick={() => handleQuantityChange(qty - 1)}>&#8211;</button>
                <h4>{qty}</h4>
                <button disabled={updating} onClick={() => handleQuantityChange(qty + 1)}>&#43;</button>
                <h3>{Math.round(acprice * qty)}</h3>
            
        </div>
    </div>
  )
}

export default Cartproduct
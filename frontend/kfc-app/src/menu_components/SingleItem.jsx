import api from "../utils/api";
import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addcartcount, deleteCart } from '../redux/action'
import styles from "./item.module.css"
import Reccom from './Reccom'
import Beverages from "./Beverages"
import { useNavigate } from 'react-router-dom'
import { resolveProductImage } from "../utils/productImage";

const SingleItem = ({_id,image,price,title,desc}) => {
const dispatch = useDispatch();
const cart = useSelector((state) => state.cart);
const productId = String(_id || title || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const count = cart.find((item) => String(item.id) === productId)?.qty || 0;
const [updating, setUpdating] = useState(false)
const navigate= useNavigate()

const saveQuantity = async (qty) => {
  if (updating || qty < 0) return;
  setUpdating(true);
  try {
    const { data } = qty === 1 && count === 0
      ? await api.post("/api/productcart/cart", { id: productId, image, price, title, desc, qty })
      : await api.put(`/api/productcart/cart/${productId}`, { qty });
    if (qty === 0) dispatch(deleteCart(productId));
    else dispatch(addcartcount(data.product));
  } catch (error) {
    console.error("Could not update cart:", error);
    alert(error.response?.data?.message || "Could not update your cart. Please try again.");
  } finally {
    setUpdating(false);
  }
}

  return (
    <div className={styles.singleupperbox} >

    <div className={styles.mainsinglebox} >
      <img src={resolveProductImage(image)} alt="food" />
      <h2>{title}</h2>
      <p className={styles.singledesc} >{desc}</p>
      <p>Calories {Math.round(Math.random()*(2000-1000)+1000)}</p>
      <h2>{price}</h2>
       
        <div className={styles.cartbutton}>
          <h3> {!count?(<p className={styles.addto}
            onClick={() => saveQuantity(1)}> {updating ? "Adding..." : "Add to cart"}</p>):(<div>

              
            <button
            className={styles.minus}
            disabled={updating}
            onClick={() => saveQuantity(count - 1)}>&#8211;</button>

            <span>{count}</span>


            <button 
            className={styles.plus}
            disabled={updating}
            onClick={() => saveQuantity(count + 1)} >&#43;</button>


           </div>)} </h3>
           <img 
          style={{cursor:"pointer"}}
          onClick={()=>{
            navigate("/cart")
          }} src="https://online.kfc.co.in/static/media/Icon_Add_to_Cart.58b87a9b.svg"/>
        </div>
        <h1 className={styles.pepsi}>You can enjoy this delicious dish with </h1>
        <Beverages/>
    </div>
    <div>
      <Reccom/>
    </div>     

    </div>
  )
}

export default SingleItem
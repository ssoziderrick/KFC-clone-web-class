import api from "../utils/api";
import React, { useState } from 'react'
import styles from "./item.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { addcartcount, deleteCart } from '../redux/action';
import { useNavigate } from 'react-router-dom';
import { resolveProductImage } from "../utils/productImage";

const Item = ({_id, id, image, price, title, desc}) => {
    const productId = String(_id || id || title || "product").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const [updating, setUpdating] = useState(false)
    const navigate= useNavigate();
    const cart= useSelector((state)=>state.cart);
    const count = cart.find((item) => String(item.id) === productId)?.qty || 0;
    const dispatch = useDispatch();

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
    };
  return (
    <div className={styles.innerbox} >
      <img onClick={()=>{
        if (_id) navigate(`/menu/${_id}`)
      }} src={resolveProductImage(image)} alt={title || "food"} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/food-placeholder.svg"; }} />
      <div>
        <h3 className={styles.title} >{title}</h3>
        <p><span style={{fontSize:"11px",background:"red",color:"red",borderRadius:"50%"}} >12</span> Non veg</p>
        <h3>{price}</h3>       
        <p className={styles.desc} >{desc}</p>
        <div className={styles.cartbutton}
        
        >
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
      </div>
    </div>
  )
}

export default Item
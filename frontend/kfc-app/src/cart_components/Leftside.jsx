import React from 'react'
import { useSelector } from 'react-redux'
import { getCart } from "../redux/action";
import { getdata } from "../utils/getdata";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cartproduct from './Cartproduct';


const Leftside = () => {
    const dispatch = useDispatch()
    const cart= useSelector((state)=>state.cart);
    
    const fetchdata = async () => {
      try {
        const payload = await getdata("/api/productcart/cart");
        dispatch(getCart(Array.isArray(payload) ? payload : (payload.items || [])));
      } catch (error) {
        console.error("Could not load cart:", error);
      }
    };

    useEffect(() => {
      fetchdata();
      // Load the server cart once when the cart page mounts.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);   

  return (
    <div>
        {cart.map((el,index)=>{
            return <Cartproduct key={index}  {...el} fetchData={fetchdata} />
        })}
    </div>
  )
}

export default Leftside
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import axios from "axios";
export const DataContext = createContext(null);

const DataContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:8000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  //   useEffect(() => {
  //     console.log(cartItems);
  //   }, [cartItems]);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.warn(`Product with ID ${item} not found in food_list.`);
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const res = await axios.get(url + "/api/food/list");
    setFoodList(res.data.data);
  };

  const loadCartData = async (token) => {
    const res = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(res.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <DataContext.Provider value={contextValue}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;

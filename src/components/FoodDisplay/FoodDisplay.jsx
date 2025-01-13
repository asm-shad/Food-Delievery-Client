import React, { useContext } from "react";
import "./FoodDisplay.css";
import { DataContext } from "../../context/DataContext";
import FoodItem from "../FoodItem/FoodItem";

function FoodDisplay({ category }) {
  const { food_list } = useContext(DataContext);
  return (
    <div className="food-display" id="food-display">
      <h2 className="h2we">Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default FoodDisplay;

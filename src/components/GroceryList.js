import styles from "./GroceryList.module.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  ListItem,
} from "@mui/material";
import { fetch_meals } from "../fetch/fetch";
import ClearIcon from "@mui/icons-material/Clear";
// import { login, get_meals } from "./../fetch/fetch";
const ALLOWED_CATEGORIES = [
  "International Food",
  "Produce",
  "Meat & Seafood",
  "Deli",
  "Dairy & Eggs",
  "Bakery & Bread",
  "Frozen",
  "Other",
];
function GroceryList({ meals, setLoggedIn, setMeals }) {
  const allItems = meals.flatMap((meal) => meal.items);

  const checkedItems = allItems.filter((item) => item.checked);

  const groupedItems = checkedItems.reduce((acc, item) => {
    // Ensure the item has a category and it's one of the allowed ones
    const category = ALLOWED_CATEGORIES.includes(item.category)
      ? item.category
      : "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const handlePicked = async (init_item) => {
    const updated_item = init_item;

    updated_item.picked = !init_item.picked;

    const updatedMeals = meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) =>
        item.id === init_item.id ? updated_item : item
      ),
    }));

    console.log(updated_item);

    setMeals(updatedMeals);
    await fetch_meals(
      "PATCH",
      `/checks/${init_item.id}`,
      updated_item,
      setLoggedIn
    );
  };

  const handleRemove = async (init_item) => {
    const updated_item = init_item;

    updated_item.checked = false;
    updated_item.picked = false;

    const updatedMeals = meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) =>
        item.id === init_item.id ? updated_item : item
      ),
    }));

    setMeals(updatedMeals);
    await fetch_meals(
      "PATCH",
      `/checks/${init_item.id}`,
      updated_item,
      setLoggedIn
    );
  };

  return (
    <div className={styles.recipecontainer}>
      <div className={styles.recipe}>
        {checkedItems.length === 0 && <h3>No Grocery List</h3>}
        {ALLOWED_CATEGORIES.map((category) => {
          const itemsInCategory = groupedItems[category];

          if (itemsInCategory && itemsInCategory.length > 0) {
            return (
              <dl key={category} className={styles.category}>
                <dt className={styles.title}>{category}</dt>
                {itemsInCategory.map((item) => (
                  <dd key={item.id || item.content} className={styles.item}>
                    <div
                      className={item.picked ? styles.picked : styles.unpicked}
                      onClick={() => handlePicked(item)}
                    >
                      {item.content}
                    </div>
                    {item.picked && (
                      <IconButton
                        aria-label="uncheck"
                        color="error"
                        onClick={() => handleRemove(item)}
                      >
                        <ClearIcon sx={{ fontSize: 16 }} color="error" />{" "}
                      </IconButton>
                    )}
                  </dd>
                ))}
              </dl>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default GroceryList;

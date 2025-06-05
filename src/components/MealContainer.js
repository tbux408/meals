import styles from "./Meals.module.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { Checkbox, FormControlLabel } from "@mui/material";
import { fetch_meals } from "../fetch/fetch";
// import { login, get_meals } from "./../fetch/fetch";

function MealContainer({ initialMealItem, setLoggedIn, setMeals }) {
  const [mealItem, setMealItem] = useState(initialMealItem);

  const handleChecked = async (event, index) => {
    const newItems = [...mealItem.items];
    newItems[index] = {
      ...newItems[index],
      checked: event.target.checked,
      picked: !event.target.checked,
    };
    setMealItem({ ...mealItem, items: newItems });
    console.log({ ...mealItem, items: newItems });
    const updated_categories = await fetch_meals(
      "PATCH",
      "/checks",
      { ...mealItem, items: newItems },
      setLoggedIn
    );

    setMeals(updated_categories);
  };

  const handleChangeAll = async (event) => {
    const isChecked = event.target.checked;
    const newItems = mealItem.items.map((item) => {
      if (item.type === "item") {
        return { ...item, checked: isChecked, picked: !isChecked };
      }
      return item;
    });
    setMealItem({ ...mealItem, items: newItems });
    const updated_categories = await fetch_meals(
      "PATCH",
      "/checks",
      { ...mealItem, items: newItems },
      setLoggedIn
    );
    setMeals(updated_categories);
  };

  // Helper to filter only 'item' types for parent checkbox logic
  const actualItems = mealItem.items.filter((item) => item.type === "item");
  const allItemsChecked = actualItems.every((item) => item.checked);
  const someItemsChecked =
    actualItems.some((item) => item.checked) && !allItemsChecked;

  return (
    <div className={styles.recipeContainer}>
      {mealItem.type === "section" ? (
        <h1>{mealItem.items[0] ? mealItem.items[0].content : ""}</h1>
      ) : (
        <div className={styles.recipe}>
          {mealItem.items.map((item, index) => {
            if (item.type === "title") {
              return (
                <div className={styles.titleContainer} key={index}>
                  <h2 className={styles.title}>{item.content}</h2>
                  <FormControlLabel
                    key={index}
                    labelPlacement="start"
                    control={
                      <Checkbox
                        checked={allItemsChecked}
                        indeterminate={someItemsChecked}
                        onChange={handleChangeAll}
                      />
                    }
                  />
                </div>
              );
            } else if (item.type === "subtitle") {
              return (
                <h3 key={index} className={styles.subtitle}>
                  {item.content}
                </h3>
              );
            } else if (item.type === "item") {
              return (
                <FormControlLabel
                  key={index}
                  label={item.content}
                  control={
                    <Checkbox
                      checked={item.checked}
                      onChange={(e) => handleChecked(e, index)}
                    />
                  }
                  sx={{ userSelect: "none" }}
                />
              );
            } else if (item.type === "link") {
              return (
                <a href={item.content} key={index}>
                  source
                </a>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default MealContainer;

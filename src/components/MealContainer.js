import styles from "./Meals.module.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { Checkbox, FormControlLabel, Skeleton } from "@mui/material";
import { fetch_meals } from "../fetch/fetch";
// import { login, get_meals } from "./../fetch/fetch";

function MealContainer({
  mealItem,
  setLoggedIn,
  setMeals,
  meals,
  setCheckingMarks,
}) {
  // const [mealItem, setMealItem] = useState(initialMealItem);

  // useEffect(() => {
  //   setMealItem(initialMealItem);
  // }, [meals, initialMealItem]);

  const handleChecked = async (event, index) => {
    const newItems = [...mealItem.items];
    newItems[index] = {
      ...newItems[index],
      checked: event.target.checked,
      picked: !event.target.checked,
    };
    // setMealItem({ ...mealItem, items: newItems });
    console.log({ ...mealItem, items: newItems });
    const updated_categories = await fetch_meals(
      "PATCH",
      "/checks",
      { ...mealItem, items: newItems },
      setLoggedIn
    );

    if (updated_categories) {
      setMeals(updated_categories);
    }
  };

  const handleChecked2 = async (init_item) => {
    setCheckingMarks(true);
    const updated_item = init_item;

    updated_item.checked = !init_item.checked;
    updated_item.picked = !init_item.checked;

    const updatedMeals = meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) =>
        item.id === init_item.id ? updated_item : item
      ),
    }));

    setMeals(updatedMeals);
    const updated_meal = await fetch_meals(
      "PATCH",
      `/checks/${init_item.id}`,
      updated_item,
      setLoggedIn
    );
    const updated_meals = meals.map((meal) => ({
      ...meal,
      items: updated_meal.id === meal.id ? updated_meal : meal.items,
    }));

    setMeals(updated_meals);

    setCheckingMarks(false);
  };

  const handleChangeAll = async (event) => {
    setCheckingMarks(true);

    const isChecked = event.target.checked;
    const newItems = mealItem.items
      .sort((a, b) => a.priority - b.priority)
      .map((item) => {
        if (item.type === "item") {
          return { ...item, checked: isChecked, picked: !isChecked };
        }
        return item;
      });
    // setMealItem({ ...mealItem, items: newItems });
    const updatedMeals = meals.map((meal) => ({
      ...meal,
      items: mealItem.id === meal.id ? newItems : meal.items,
    }));

    setMeals(updatedMeals);

    const updated_meal = await fetch_meals(
      "PATCH",
      "/checks",
      { ...mealItem, items: newItems },
      setLoggedIn
    );

    const updated_meals = meals.map((meal) => ({
      ...meal,
      items: updated_meal.id === meal.id ? updated_meal : meal.items,
    }));

    setMeals(updated_meals);

    setCheckingMarks(true);
  };

  // Helper to filter only 'item' types for parent checkbox logic
  const actualItems = mealItem.items.filter((item) => item.type === "item");
  const allItemsChecked = actualItems.every((item) => item.checked);
  const someItemsChecked =
    actualItems.some((item) => item.checked) && !allItemsChecked;

  return (
    <div className={styles.recipeContainer} id={mealItem.id + "item"}>
      {mealItem.type === "section" ? (
        <h1>{mealItem.items[0] ? mealItem.items[0].content : ""}</h1>
      ) : (
        <div className={styles.recipe}>
          {mealItem.items
            .sort((a, b) => a.priority - b.priority)
            .map((item, index) => {
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
                        onChange={() => handleChecked2(item)}
                        // size="small"
                        sx={{ padding: "3px" }}
                      />
                    }
                    sx={{ userSelect: "none", marginBottom: "12px" }}
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

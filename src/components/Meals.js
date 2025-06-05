import styles from "./Meals.module.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import MealContainer from "./MealContainer";
// import { login, get_meals } from "./../fetch/fetch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable, // This hook is key for making items sortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // For transform styling
import SortableMealItem from "./SortableMealItem";
import { Divider, Fab, IconButton, Tab, Tabs } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { fetch_meals, get_meals } from "../fetch/fetch";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import GroceryList from "./GroceryList";

function Meals({ meals, setMeals, setLoggedIn }) {
  //   const [passcode, setPasscode] = useState("");

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: "long", // "Monday"
      month: "long", // "June"
      day: "numeric", // "6"
      hour: "numeric", // "10"
      minute: "2-digit", // "38"
      hour12: true, // Use 12-hour clock (e.g., "AM/PM")
    };

    // Use Intl.DateTimeFormat for robust and localized formatting
    // You can specify a locale, e.g., 'en-US'
    const formatter = new Intl.DateTimeFormat(undefined, options);
    return formatter.format(date);
  };

  const [mealsData, setMealsData] = useState([]);

  const [isAnyItemDragging, setIsAnyItemDragging] = useState(false);

  // Setup sensors for DndContext
  const sensors = useSensors(
    useSensor(PointerSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // Essential for keyboard accessibility
    })
  );

  // Function called when a drag ends
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = meals.findIndex((item) => item.id === active.id);
      const newIndex = meals.findIndex((item) => item.id === over.id);
      const new_array = arrayMove(meals, oldIndex, newIndex);

      setMeals(new_array);
      const priorityUpdates = new_array.map((meal, index) => ({
        id: meal.id,
        priority: index,
      }));

      fetch_meals("PATCH", "/priority", priorityUpdates, setLoggedIn);
    }
  }

  function arrayMove(array, oldIndex, newIndex) {
    const newArray = [...array];
    const [movedItem] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, movedItem);
    return newArray;
  }

  const [editMode, setEditMode] = useState(false);
  const [mode, setMode] = useState(0);

  const handleInsert = async (index = 0, type = "meal") => {
    if (type === "section") {
      const new_meal = await fetch_meals(
        "POST",
        "/meals",
        {
          id: -1,
          type: "section",
          priority: index,
          items: [
            {
              id: -1,
              priority: 0,
              type: "title",
              content: "",
              checked: false,
              category: "",
              picked: false,
            },
          ],
        },
        setLoggedIn
      );
      setMeals([...meals.slice(0, index), new_meal, ...meals.slice(index)]);
    } else {
      const new_meal = await fetch_meals(
        "POST",
        "/meals",
        {
          id: -1,
          type: "meal",
          priority: index,
          items: [
            {
              id: -1,
              priority: 0,
              checked: false,
              type: "title",
              content: "",
              category: "",
              picked: false,
            },
          ],
        },
        setLoggedIn
      );
      setMeals([...meals.slice(0, index), new_meal, ...meals.slice(index)]);
    }
  };

  const handleCheck = async () => {
    // const out = await get_meals("/hello", setLoggedIn);
    console.log(meals);
  };

  const setMealsHelper = (new_meal) => {
    meals.find((meal) => meal.id === new_meal.id).items = new_meal.items;
    setMeals([...meals]);
  };

  const handleChangeMode = (event, newValue) => {
    console.log("Mode changed to:", newValue);
    setMode(newValue);
  };

  return (
    <div className={styles.body}>
      {/* {meals} */}
      <Tabs
        value={mode}
        onChange={handleChangeMode}
        aria-label="icon tabs example"
      >
        <Tab icon={<RestaurantIcon />} aria-label="recipes" />
        <Tab icon={<LocalGroceryStoreIcon />} aria-label="grocery" />
        <Tab icon={<EditNoteIcon />} aria-label="edit" />
      </Tabs>
      {/* <IconButton aria-label="edit" onClick={() => setEditMode(!editMode)}>
        <EditNoteIcon />
      </IconButton> */}
      <h1>{formatDateTime(currentDateTime)}</h1>
      <Divider />
      {mode === 2 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Fab
            color="success"
            aria-label="add"
            onClick={() => handleInsert(0, "section")}
            title="add section"
            size="small"
            sx={{ margin: "0.5rem" }}
          >
            <ViewStreamIcon />
          </Fab>
          <Fab
            color="success"
            aria-label="add"
            onClick={() => handleInsert(0)}
            title="add meal"
            size="small"
          >
            <LunchDiningIcon />
          </Fab>
          <SortableContext
            items={meals.map((meal) => meal.id)} // Pass only the IDs to SortableContext
            strategy={verticalListSortingStrategy} // For vertical lists
          >
            <div>
              {meals.map((mealItem, index) => (
                <SortableMealItem
                  key={mealItem.id}
                  index={index}
                  handleInsert={handleInsert}
                  mealItem={mealItem}
                  isAnyItemDragging={isAnyItemDragging}
                  setMealsData={setMeals}
                  mealsData={mealsData}
                  setLoggedIn={setLoggedIn}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}{" "}
      {mode === 0 && (
        <div className={styles.mealsList}>
          {meals.map((mealItem) => (
            <MealContainer
              key={mealItem.id}
              initialMealItem={mealItem}
              setMeals={setMealsHelper}
              setLoggedIn={setLoggedIn}
            />
          ))}
        </div>
      )}
      {mode === 1 && (
        <div className={styles.mealsList}>
          <GroceryList
            meals={meals}
            setLoggedIn={setLoggedIn}
            setMeals={setMeals}
          />
        </div>
      )}
    </div>
  );
}

export default Meals;

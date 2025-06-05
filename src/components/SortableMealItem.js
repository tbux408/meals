import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable, // This hook is key for making items sortable
} from "@dnd-kit/sortable";
import styles from "./Meals.module.css";
import { CSS } from "@dnd-kit/utilities"; // For transform styling
import {
  Checkbox,
  CircularProgress,
  Fab,
  FormControlLabel,
  IconButton,
  TextareaAutosize,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import React, { useEffect, useState } from "react";
import ReplayIcon from "@mui/icons-material/Replay";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import AddIcon from "@mui/icons-material/Add";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { fetch_meals } from "../fetch/fetch";

export default function SortableMealItem({
  mealItem,
  setMealsData,
  index,
  handleInsert,
  setLoggedIn,
}) {
  // useSortable hook is used on the individual draggable items
  const {
    attributes,
    listeners, // These listeners are for the drag handle!
    setNodeRef, // Ref to attach to the draggable element
    transform,
    transition,
    isDragging, // Indicates if the current item is being dragged
  } = useSortable({ id: mealItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Optional: make dragged item semi-transparent
    zIndex: isDragging ? 100 : "auto", // Optional: bring dragged item to front
  };

  const [editValue, setEditValue] = useState(
    mealItem.items
      .map((item, index) => {
        if (item.type === "item") {
          return "-" + item.content;
        }
        return item.content;
      })
      .join("\n")
  );

  const [saving, setSaving] = useState(0);

  const handleChange = (event) => {
    setEditValue(event.target.value);
    setSaving(1);
  };

  const packagePayload = (content) => {
    const new_content = content.split("\n").map((line, index) => {
      if (line.startsWith("-")) {
        return {
          id: -1,
          type: "item",
          content: line.slice(1).trim(),
          checked:
            mealItem.items.find((item) => item.content === line.slice(1).trim())
              ?.checked || false,
          priority: index,
          category:
            mealItem.items.find((item) => item.content === line.slice(1).trim())
              ?.category || "",
          picked:
            mealItem.items.find((item) => item.content === line.slice(1).trim())
              ?.picked || false,
        };
      } else if (line.startsWith("http")) {
        return {
          id: -1,
          type: "link",
          content: line.trim(),
          checked: false,
          priority: index,
          category: "",
          picked: false,
        };
      } else if (index === 0) {
        return {
          id: -1,
          type: "title",
          content: line.trim(),
          checked: false,
          priority: index,
          category: "",
          picked: false,
        };
      } else {
        return {
          id: -1,
          type: "subtitle",
          content: line.trim(),
          checked: false,
          priority: index,
          category: "",
          picked: false,
        };
      }
    });

    return new_content;
  };

  const handleBlur = async (event) => {
    setSaving(2);
    if (editValue === "") {
      await fetch_meals("DELETE", `/meals/${mealItem.id}`, "", setLoggedIn);
      setMealsData((prevMeals) =>
        prevMeals.filter((item) => item.id !== mealItem.id)
      );
    } else {
      const new_content = packagePayload(event.target.value);

      const new_meal = await fetch_meals(
        "PUT",
        `/meals/${mealItem.id}`,
        new_content,
        setLoggedIn
      );
      mealItem.items = new_meal.items;
    }
    setSaving(0);
  };

  return (
    <div
      ref={setNodeRef} // Attach the ref from useSortable
      style={style}
    >
      {mealItem.type === "section" ? (
        <input
          value={editValue}
          className={styles.sectionedit}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="New Section"
        />
      ) : (
        <div className={styles.recipe}>
          <div className={styles.save}>
            {saving === 2 && <CircularProgress size="10px" />}
          </div>
          <div
            className={styles.draghandle}
            {...attributes} // Attributes for accessibility (aria-role etc.)
            {...listeners} // Listeners for pointer/keyboard events to initiate drag className={styles.draghandle}
          >
            <DragIndicatorIcon />
          </div>

          <TextareaAutosize
            aria-label="text area"
            minRows={4}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
            }}
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="New Meal
https://tylerbuxton.com/
New Subtitle
-New Item"
          />
        </div>
      )}
      <div className={styles.addcontainer}>
        <div className={styles.addbutton}>
          <Fab
            color="success"
            aria-label="add"
            onClick={() => handleInsert(index + 1, "section")}
            title="add section"
            size="small"
          >
            <ViewStreamIcon />
          </Fab>
          <Fab
            color="success"
            aria-label="add"
            onClick={() => handleInsert(index + 1)}
            title="add meal"
            size="small"
          >
            <LunchDiningIcon />
          </Fab>
        </div>
      </div>
    </div>
  );
}

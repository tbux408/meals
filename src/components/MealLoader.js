import styles from "./Meals.module.css";
import React, { useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { Checkbox, FormControlLabel, Skeleton } from "@mui/material";
import { fetch_meals } from "../fetch/fetch";
// import { login, get_meals } from "./../fetch/fetch";

function MealLoader({ isLoading = true }) {
  if (isLoading) {
    return (
      <div className={styles.recipeContainer}>
        <Skeleton
          variant="rounded"
          width={"100%"}
          height={40}
          sx={{ maxWidth: "250px", marginTop: "1rem" }}
        />

        <div className={styles.recipeLoader}>
          <Skeleton variant="rounded" width={"100%"} height={120} />
        </div>
        <div className={styles.recipeLoader}>
          <Skeleton variant="rounded" width={"100%"} height={120} />
        </div>
        <Skeleton
          variant="rounded"
          width={"100%"}
          height={40}
          sx={{ maxWidth: "250px" }}
        />

        <div className={styles.recipeLoader}>
          <Skeleton variant="rounded" width={"100%"} height={120} />
        </div>
      </div>
    );
  }
}

export default MealLoader;

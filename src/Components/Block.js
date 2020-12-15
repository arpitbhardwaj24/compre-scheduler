import { Box, Grid } from "@material-ui/core";
import React, { useContext } from "react";
import PeopleIcon from "@material-ui/icons/People";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../utils/items";
import { BlockContext } from "../App";

export default function Block({ data, row, col }) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.CARD,
      data,
      row,
      col,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <Box
      ref={drag}
      boxShadow={3}
      margin="10px"
      style={{
        background: "#9FA8DA",
        borderRadius: "5px",
        opacity: isDragging ? "0.5" : "1",
        cursor: "move",
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "white",
          textAlign: "left",
          padding: 5,
        }}
      >
        {data.name}
      </div>
      <div
        style={{
          fontSize: 14,
          padding: 5,
          paddingLeft: 10,
          color: "#9FA8DA",
          textAlign: "left",
          marginTop: 5,
          background: "white",
          borderRadius: "0 0 5px 5px",
          display: "flex",
        }}
      >
        <Grid container direction="row" spacing={0}>
          <Grid item>
            <PeopleIcon fontSize="inherit"></PeopleIcon>
          </Grid>
          <Grid item>{data.capacity}</Grid>
        </Grid>
      </div>
    </Box>
  );
}

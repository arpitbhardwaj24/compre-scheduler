import { Box } from "@material-ui/core";
import { useContext } from "react";
import { useDrop } from "react-dnd";
import { BlockContext } from "../App";
import { TableContext } from "../Components/Table";
import { ItemTypes } from "../utils/items";
import "../App.css";

export default function BlockTarget(props) {
  const { deleteBlock } = useContext(BlockContext);
  const { deleteFromTarget, addToTarget } = useContext(TableContext);
  const row = props.row;
  const col = props.col;

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      console.log(item);
      if (item.row === -1) {
        console.log("Yess");
        deleteBlock(item.data.name);
      } else deleteFromTarget(item.data.name, item.row, item.col);
      addToTarget(item.data, row, col);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      class="box"
      style={{
        background: isOver ? "#7986CB33" : "",
        transitionDuration: "0.5s",
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
    >
      {props.children}
    </Box>
  );
}

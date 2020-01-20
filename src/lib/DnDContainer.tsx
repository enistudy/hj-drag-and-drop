import React, { useCallback } from "react";
import {
  dragStartHandler,
  dragEnterHandler,
  dragLeaveHandler,
  dragEndHandler,
} from "./handlers";

interface Props {
  container: string;
  group: string;
  items: any[];
  shadowOpacity?: string;
  transitionDuration?: number;
  [key: string]: any;
}

const DnDContainer: React.FC<Props> = ({
  container,
  group,
  shadowOpacity,
  transitionDuration,
  items,
  children,
  style,
  ...rest
}) => {
  style = {
    marginBlockStart: "0px",
    marginBlockEnd: "0px",
    paddingInlineStart: "0px",
    listStyle: "none",
    ...style,
  };

  const info: InfoOfDraggedElement = {
    source: null,
    group: "",
  };

  const onDragStart = useCallback(
    e => dragStartHandler(e, info, shadowOpacity),
    [info],
  );

  const onDragEnter = useCallback(
    e => dragEnterHandler(e, info, transitionDuration),
    [info],
  );

  const onDragOver = useCallback(e => e.preventDefault(), []);

  const onDrop = useCallback(e => e.preventDefault(), []);

  const onDragLeave = useCallback(e => dragLeaveHandler(e, info), [info]);

  const onDragEnd = useCallback(e => dragEndHandler(e, info), [info]);

  return (
    <ul
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      data-container={container}
      data-group={group}
      style={style}
      {...rest}
    >
      {children}
    </ul>
  );
};

export default DnDContainer;

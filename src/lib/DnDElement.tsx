import React from "react";

interface Props {
  [key: string]: any;
}

const DnDElement: React.FC<Props> = ({ children, ...rest }) => {
  return (
    <li {...rest} draggable>
      {children}
    </li>
  );
};

export default DnDElement;

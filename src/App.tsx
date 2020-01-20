import React from "react";

import { DnDContainer, DnDElement } from "./lib";
import "./App.css";

const App: React.FC = () => {
  const items = [
    { id: 1, content: "item1" },
    { id: 2, content: "item2" },
    { id: 3, content: "item3" },
    { id: 4, content: "item4" },
    { id: 5, content: "item5" },
    { id: 6, content: "item6" },
  ];

  return (
    <div className="container">
      <h1>hj-drag-and-drop</h1>
      <h2>Typescript-based react library for sortable drag and drop</h2>
      <h2 className="sub-title">Examples</h2>
      <hr className="horizontal-line" />
      <h3 className="sub-title">Single List</h3>
      <DnDContainer
        container="example1"
        group="group1"
        shadowOpacity="0.6"
        transitionDuration={300}
        items={items}
        className="dnd-container"
      >
        {items.map(obj => (
          <DnDElement key={`###${obj.id}`} className="dnd-element">
            {obj.content}
          </DnDElement>
        ))}
      </DnDContainer>
      <h3 className="sub-title">Multiple List</h3>
      <div className="example2">
        <DnDContainer
          container="example2-left"
          group="group2"
          shadowOpacity="0.6"
          transitionDuration={300}
          items={items}
          className="dnd-container-left"
        >
          {items.map(obj => (
            <DnDElement key={`####${obj.id}`} className="dnd-element">
              {obj.content}
            </DnDElement>
          ))}
        </DnDContainer>
        <DnDContainer
          container="example2-right"
          group="group2"
          shadowOpacity="0.6"
          transitionDuration={300}
          items={items}
          className="dnd-container-right"
        >
          {items.map(obj => (
            <DnDElement key={`#####${obj.id}`} className="dnd-element-right">
              {obj.content}
            </DnDElement>
          ))}
        </DnDContainer>
      </div>
    </div>
  );
};

export default App;

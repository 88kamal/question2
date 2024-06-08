import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

// Define a type for draggable items
const ItemType = {
  COLOR: 'color',
};

// ColorBox component to display each color
const ColorBox = ({ color, index, moveColor, replaceColor }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.COLOR,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.COLOR,
    hover: (item) => {
      if (item.index !== index) {
        moveColor(item.index, index);
        item.index = index;
      }
    },
  });

  const handleColorChange = () => {
    const newColor = prompt('Enter a new color in hex (e.g., #ff0000):', color);
    if (newColor) {
      replaceColor(index, newColor);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        margin: '5px',
      }}
      onClick={handleColorChange}
    >
    </div>
  );
};

// Main ColorPalette component
const ColorPalette = () => {
  const [colors, setColors] = useState([
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000',
  ]);

  const moveColor = (fromIndex, toIndex) => {
    const newColors = update(colors, {
      $splice: [
        [fromIndex, 1],
        [toIndex, 0, colors[fromIndex]],
      ],
    });
    setColors(newColors);
  };

  const replaceColor = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '420px' }}>
        {colors.map((color, index) => (
          <ColorBox
            key={index}
            index={index}
            color={color}
            moveColor={moveColor}
            replaceColor={replaceColor}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default ColorPalette;

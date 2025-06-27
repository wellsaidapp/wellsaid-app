import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, Trash2 } from "lucide-react";

const DraggableEntry = ({ entry, index, moveEntry, onRemove }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'ENTRY',
    item: { index, id: entry.id },
    collect: (monitor) => {
      console.log("Setting up drag for index", index);  // ✅ Add this
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const [, drop] = useDrop({
    accept: 'ENTRY',
    hover(item, monitor) {
      console.log("Hovering:", item.index, "→", index);
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      moveEntry(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm transition-transform duration-200 ease-in-out flex flex-col sm:flex-row sm:items-center gap-3 cursor-grab"
    >
      <GripVertical className="w-5 h-5 text-gray-400 sm:mt-0 mt-1" />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 mb-1">
          Page {index + 1}
        </div>
        {entry.question && (
          <div className="text-sm text-gray-600 break-words">
            {entry.question}
          </div>
        )}
      </div>

      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 sm:self-auto self-end"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DraggableEntry;

import React, { useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GripVertical, Trash2 } from "lucide-react";
import { getEmptyImage } from 'react-dnd-html5-backend';

const DraggableEntry = ({ entry, index, moveEntry, onRemove }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'ENTRY',
    item: { index, id: entry.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ENTRY',
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveEntry(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-4 border rounded-xl shadow-sm transition-transform duration-200 ease-in-out flex flex-col sm:flex-row sm:items-start gap-3 cursor-grab ${
        isDragging
          ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-400 scale-[1.01] shadow-md opacity-90'
          : 'border-gray-200 bg-white'
      }`}
    >
      <GripVertical className="w-5 h-5 text-gray-400 mt-1 sm:mt-0" />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 mb-1 whitespace-pre-wrap break-words">
          {entry.prompt || 'Untitled'}
        </div>
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

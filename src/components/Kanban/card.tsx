import React from 'react';
import { useDraggable } from '@dnd-kit/core';

type CardProps = {
    text: string;
    index: number;
    column: string;
};

const Card: React.FC<CardProps> = ({ text, index, column }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: text,
        data: { column, index }
    });

    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        border: 'none',
        padding: '0.5rem',
        margin: '0.5rem 0',
        backgroundColor: 'white',
        opacity: isDragging ? 0.7 : 1,
        cursor: 'grab',
        borderRadius: '5px'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {text}
        </div>
    );
};

export default Card;
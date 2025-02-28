import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card';

type ColumnProps = {
    id: string;
    tasks: string[];
};

const Column: React.FC<ColumnProps> = ({ id, tasks }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            style={{
                padding: '1rem',
                width: '50%',
                background: '#8cff9a',
                borderRadius: '5px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Sombra adicionada
                border: 'none', // Remove a borda
            }}
        >
            <h3 style={{ textTransform: 'capitalize', fontWeight:"500" }}>{id.replace('_', ' ')}</h3>
            {tasks.map((task, index) => (
                <Card key={task} text={task} index={index} column={id} />
            ))}
        </div>
    );
};

export default Column;
import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Column from './column';
import { Box } from '@chakra-ui/react';
import { AddButton } from '../AddButton';

const Kanban: React.FC = () => {
    const [tasks, setTasks] = useState({
        "para_fazer": ["Viagem", "Comida"],
        "em_andamento": ["Roda punk"],
        "batida": []
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const fromColumn = active.data.current?.column;
        const toColumn = over.id;

        if (fromColumn !== toColumn) {
            setTasks((prev: any) => {
                const sourceItems = [...prev[fromColumn]];
                const targetItems = [...prev[toColumn]];
                const [movedItem] = sourceItems.splice(active.data.current?.index, 1);
                targetItems.push(movedItem);

                return {
                    ...prev,
                    [fromColumn]: sourceItems,
                    [toColumn]: targetItems
                };
            });
        }
    };

    return (
        <>
            
            <Box height={"20%"}>

                <Box paddingTop={"3rem"}>
                <AddButton text='Adicionar Meta' onClick={() => {}}/>
                </Box>

            </Box >


            <Box height={"79%"} background={"white"}>
                <DndContext onDragEnd={handleDragEnd}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {Object.entries(tasks).map(([columnId, items]) => (
                            <Column key={columnId} id={columnId} tasks={items} />
                        ))}
                    </div>
                </DndContext>
            </Box>


        </>
    );
};

export default Kanban;
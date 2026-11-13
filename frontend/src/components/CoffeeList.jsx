// frontend/src/components/CoffeeList.jsx
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Importação do ícone de destaque
import { BiSolidBadgeCheck } from 'react-icons/bi'; 

const PlaceholderImage = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" fill="#E0E0E0" />
    <path d="M25 15L35 35H15L25 15Z" fill="#BDBDBD" />
    <circle cx="35" cy="15" r="5" fill="#BDBDBD" />
  </svg>
);

const SortableItem = ({ coffee, onSelectCoffee }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: coffee.coffeeId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelectCoffee(coffee)}
      className={`bg-white p-3 rounded border border-gray-200 flex items-center justify-between space-x-3 hover:bg-gray-50 transition duration-200 ${isDragging ? 'shadow-lg' : ''}`}
    >

      <div className="flex items-center gap-4">
				{/* Container da Imagem */}
				<div className="flex-shrink-0">
					{coffee.coffeeImage ? (
						<img
							src={`http://localhost:3001${coffee.coffeeImage}`}
							alt={coffee.coffeeName}
							className="w-12 h-12 object-cover rounded border border-gray-200 thumb"
						/>
					) : (
						<PlaceholderImage />
					)}
				</div>
				<div className="flex-grow">
					<p>
						<span className="pRoaster text-gray-400 tracking-widest">{coffee.coffeeRoaster}</span>
						<span className="pCoffeeName text-gray-900">{coffee.coffeeName}</span>
					</p>
				</div>
			</div>
			
			{/* Ícone de destaque posicionado à esquerda, dentro do container flex */}
      {coffee.coffeeTop && (
        <div className="flex-shrink-0">
          <BiSolidBadgeCheck className="text-yellow-500 text-2xl" title="Café de Destaque" />
        </div>
      )}

		</div>
  );
};

const CoffeeList = ({ coffees, onSelectCoffee }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (coffees && coffees.length > 0) {
      const validCoffees = coffees.filter(c => c?.coffeeId != null);
      // NOVA ordenação: cafés SEM coffeeOrder vêm primeiro, depois os demais ordenados por coffeeOrder
      const sorted = [...validCoffees].sort((a, b) => {
        const aOrder = a.coffeeOrder;
        const bOrder = b.coffeeOrder;

        if (aOrder == null && bOrder == null) return 0;        // Ambos sem ordem, iguais
        if (aOrder == null) return -1;                          // a vem antes
        if (bOrder == null) return 1;                           // b vem antes
        return aOrder - bOrder;                                 // ordena crescente
      });
      setItems(sorted);
    } else {
      setItems([]);
    }
  }, [coffees]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.coffeeId === active.id);
      const newIndex = items.findIndex(item => item.coffeeId === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const orderPayload = newItems.map((item, index) => ({
        coffeeId: item.coffeeId,
        order: index,
      }));

      try {
        const response = await fetch('http://localhost:3001/api/coffees/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: orderPayload }),
        });
        if (!response.ok) throw new Error('Erro ao salvar nova ordem');
      } catch (error) {
        console.error('Erro no reorder:', error);
        setItems(items); // Reverte ordem local
      }
    }
  };

  const handleSaveCoffee = async (coffee) => {
    const formData = new FormData();

    formData.append('coffeeName', coffee.coffeeName);
    formData.append('coffeeRoaster', coffee.coffeeRoaster);
    formData.append('coffeeBeanType', coffee.coffeeBeanType);
    formData.append('coffeeVariation', coffee.coffeeVariation);
    formData.append('coffeeProcess', coffee.coffeeProcess);
    formData.append('coffeeType', coffee.coffeeType);
    
    // Converting dates to ISO string format (yyyy-mm-dd)
    formData.append('coffeeRoastDate', coffee.coffeeRoastDate ? new Date(coffee.coffeeRoastDate).toISOString().split('T')[0] : '');
    formData.append('coffeePurchaseDate', coffee.coffeePurchaseDate ? new Date(coffee.coffeePurchaseDate).toISOString().split('T')[0] : '');

    if (coffee.coffeeImage) {
      formData.append('coffeeImage', coffee.coffeeImage);
    }

    try {
      const response = await fetch('http://localhost:3001/api/coffees', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar café');
      }

      // Handle response or update UI after successful submission
    } catch (error) {
      console.error('Erro ao salvar café:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-gray-600 text-center py-4">
        <p>Nenhum café cadastrado ainda.</p>
        <p>Use o botão "Cadastrar Novo Café" para começar!</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.coffeeId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map(coffee => (
            <SortableItem
              key={coffee.coffeeId}
              coffee={coffee}
              onSelectCoffee={onSelectCoffee}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default CoffeeList;
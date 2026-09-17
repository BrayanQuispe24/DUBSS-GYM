// src/features/gyms/components/CategoryBar.tsx
import React from 'react';
import { useGymFilterStore } from '../store/gymFilterStore';
import { LayoutGrid, Dumbbell, Shield, Music, Flame, Activity } from 'lucide-react';

const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory } = useGymFilterStore();

  const categories = [
    { id: 'all', label: 'Todos los Servicios', icon: LayoutGrid },
    { id: 'aparatos', label: 'Gimnasio & Aparatos', icon: Dumbbell },
    { id: 'boxeo', label: 'Boxeo', icon: Shield },
    { id: 'kickboxing', label: 'Kick Boxing', icon: Activity },
    { id: 'baile', label: 'Baile & Zumba', icon: Music },
    { id: 'funcional', label: 'Entrenamiento Funcional', icon: Flame },
  ];

  return (
    <section className="category-bar-section reveal-up">
      <div className="container">
        <div className="category-carousel-wrapper">
          <div className="category-slider" id="category-slider">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;

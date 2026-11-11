// src/features/gyms/components/CategoryBar.tsx
import React from 'react';
import { useGymFilterStore } from '../store/gymFilterStore';
import { usePublicLanding } from '@/features/landing/hooks/usePublicLanding';
import { getDisciplinaVisualMeta } from '@/features/landing/utils/disciplinaVisuals';
import { LayoutGrid } from 'lucide-react';

const CategoryBar: React.FC = () => {
  const { activeCategory, setActiveCategory } = useGymFilterStore();
  const { data } = usePublicLanding();

  const categories = [
    { id: 'all', label: 'Todos los Servicios', icon: LayoutGrid },
    ...(data?.disciplinas ?? []).map((disc) => {
      const meta = getDisciplinaVisualMeta(disc.nombre);
      return {
        id: meta.slug,
        label: disc.nombre,
        icon: meta.icon,
      };
    }),
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

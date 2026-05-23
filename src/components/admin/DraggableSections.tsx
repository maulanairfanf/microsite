'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { clientApi } from '@/lib/client-api';

interface SectionItem {
  id: string;
  order: number;
  component: { id: string; name: string } | null;
  configJson: string | null;
}

interface DraggableSectionCardProps {
  section: SectionItem;
}

function extractTitle(configJson: string | null): string | null {
  if (!configJson) return null;
  try {
    const config = JSON.parse(configJson);
    return config.title || config.name || config.heading || null;
  } catch {
    return null;
  }
}

function SortableSectionCard({ section }: DraggableSectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const title = extractTitle(section.configJson);

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {section.order}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {title || section.component?.name || 'Untitled'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {section.component?.name}
              </p>
            </div>
          </div>
          <Link href={`/admin/sections/${section.id}`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

interface DraggableSectionsProps {
  initialSections: SectionItem[];
  tenantId: string;
}

export function DraggableSections({ initialSections, tenantId }: DraggableSectionsProps) {
  const [sections, setSections] = useState(initialSections);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);

      // Update order values and set state
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      // Optimistically update UI
      setSections(updatedSections);

      // Send to API
      setLoading(true);
      try {
        await clientApi.put('/api/sections/reorder', {
          sections: updatedSections.map((s) => ({
            id: s.id,
            order: s.order,
          })),
        });
      } catch (err) {
        console.error('Failed to reorder sections:', err);
        setSections(sections);
      } finally {
        setLoading(false);
      }
    }
  }

  // Don't render DndContext until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {section.order}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {section.component?.name || 'Untitled'}
                  </h4>
                </div>
              </div>
              <Link href={`/admin/sections/${section.id}`}>
                <Button variant="secondary" size="sm">Edit</Button>
              </Link>
            </div>
          </Card>
        ))}
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
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-4">
          {sections.map((section) => (
            <SortableSectionCard key={section.id} section={section} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
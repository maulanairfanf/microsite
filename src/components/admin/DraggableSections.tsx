"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Lock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { clientApi } from "@/lib/client-api";
import { useIsClient } from "@/lib/useIsClient";
import { ComponentName } from "@/lib/components/componentNames";
import type { SectionCardItem } from "@/lib/db/types";

interface DraggableSectionCardProps {
  section: SectionCardItem;
  onDeleted: (id: string) => void;
  onError: (message: string) => void;
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

function SortableSectionCard({ section, onDeleted, onError }: DraggableSectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const [deleting, setDeleting] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const title = extractTitle(section.configJson);
  const isHero = section.component?.name === ComponentName.Hero;

  async function handleDelete() {
    if (!confirm(`Delete "${title || section.component?.name || "this section"}"?`)) {
      return;
    }
    setDeleting(true);
    try {
      await clientApi.delete(`/api/sections/${section.id}`);
      onDeleted(section.id);
    } catch (err: any) {
      onError(err.message || "Failed to delete section");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing shrink-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">{section.order}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium text-gray-900 truncate">
                  {title || section.component?.name || "Untitled"}
                </h4>
                {isHero && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    <Lock className="w-3 h-3" />
                    Hero
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {section.component?.displayName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/admin/sections/${section.id}`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            {!isHero && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete section"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function StaticSectionRow({ section, onDeleted, onError }: DraggableSectionCardProps) {
  const [deleting, setDeleting] = useState(false);
  const title = extractTitle(section.configJson);
  const isHero = section.component?.name === ComponentName.Hero;

  async function handleDelete() {
    if (!confirm(`Delete "${title || section.component?.name || "this section"}"?`)) {
      return;
    }
    setDeleting(true);
    try {
      await clientApi.delete(`/api/sections/${section.id}`);
      onDeleted(section.id);
    } catch (err: any) {
      onError(err.message || "Failed to delete section");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{section.order}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-gray-900 truncate">
                {title || section.component?.name || "Untitled"}
              </h4>
              {isHero && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  <Lock className="w-3 h-3" />
                  Hero
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{section.component?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/admin/sections/${section.id}`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          {!isHero && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

interface DraggableSectionsProps {
  initialSections: SectionCardItem[];
  tenantId: string;
}

export function DraggableSections({ initialSections, tenantId }: DraggableSectionsProps) {
  const [sections, setSections] = useState(initialSections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const mounted = useIsClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);

      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      setSections(updatedSections);

      setLoading(true);
      try {
        await clientApi.put("/api/sections/reorder", {
          sections: updatedSections.map((s) => ({
            id: s.id,
            order: s.order,
          })),
        });
      } catch (err) {
        console.error("Failed to reorder sections:", err);
        setSections(sections);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleDeleted(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function handleError(message: string) {
    setError(message);
    setTimeout(() => setError(""), 5000);
  }

  if (!mounted) {
    return (
      <div className="grid gap-4">
        {sections.map((section) => (
          <StaticSectionRow
            key={section.id}
            section={section}
            onDeleted={handleDeleted}
            onError={handleError}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4">
            {sections.map((section) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                onDeleted={handleDeleted}
                onError={handleError}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

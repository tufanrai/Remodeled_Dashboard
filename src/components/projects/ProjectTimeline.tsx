import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calendar } from "lucide-react";

export interface Milestone {
  id: string;
  title: string;
  year: string;
}

interface ProjectTimelineProps {
  milestones: Milestone[];
  onChange: (milestones: Milestone[]) => void;
}

export function ProjectTimeline({ milestones, onChange }: ProjectTimelineProps) {
  const addMilestone = () => {
    onChange([
      ...milestones,
      { id: Date.now().toString(), title: "", year: "" }
    ]);
  };

  const updateMilestone = (id: string, field: keyof Omit<Milestone, "id">, value: string) => {
    onChange(
      milestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      )
    );
  };

  const removeMilestone = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Project Timeline
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
          <Plus className="mr-1 h-3 w-3" />
          Add Milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No milestones added yet. Click "Add Milestone" to start.
        </p>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-3 items-start p-3 bg-background/50 rounded-lg">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Milestone Title</Label>
                  <Input
                    placeholder="e.g., Construction Started"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, "title", e.target.value)}
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Year</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 2020"
                    value={milestone.year}
                    onChange={(e) => updateMilestone(milestone.id, "year", e.target.value)}
                    className="bg-muted/30"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMilestone(milestone.id)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

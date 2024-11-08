// components/journal/RehabTasks.jsx
"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, X, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const RehabTasks = forwardRef(({ initialTasks = [] }, ref) => {
  const [tasks, setTasks] = useState(
    initialTasks.length > 0
      ? initialTasks.map((task, index) => ({
          id: `task-${index}`,
          text: task.text,
          completed: task.completed || false,
        }))
      : [{ id: "task-0", text: "", completed: false }]
  );

  useImperativeHandle(ref, () => ({
    getTasks: () =>
      tasks
        .filter((task) => task.text.trim() !== "")
        .map((task) => ({
          text: task.text,
          completed: task.completed,
        })),
  }));

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      { id: `task-${prev.length}`, text: "", completed: false },
    ]);
  };

  const updateTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label>Rehab Checklist</Label>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="h-5 w-5"
          />
          <div className="flex-1">
            <Input
              value={task.text}
              onChange={(e) => updateTask(task.id, e.target.value)}
              placeholder="Enter rehab task..."
              className={cn(
                "transition-all duration-200",
                task.completed && "line-through text-muted-foreground"
              )}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeTask(task.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={addTask}
        className="w-full"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
});

RehabTasks.displayName = "RehabTasks";

export default RehabTasks;

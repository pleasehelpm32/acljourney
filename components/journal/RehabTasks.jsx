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

  const handleKeyDown = (e, taskId, isLastTask) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission

      const currentTask = tasks.find((task) => task.id === taskId);

      // Only add new task if current task has content
      if (currentTask.text.trim() && isLastTask) {
        addTask();
        // Focus the new input after React re-renders
        setTimeout(() => {
          const inputs = document.querySelectorAll("[data-rehab-task-input]");
          inputs[inputs.length - 1]?.focus();
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label>Rehab Checklist</Label>
      {tasks.map((task, index) => (
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
              onKeyDown={(e) =>
                handleKeyDown(e, task.id, index === tasks.length - 1)
              }
              placeholder="Enter rehab task..."
              data-rehab-task-input // Added for focusing
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

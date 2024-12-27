"use client";

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  KeyboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface RehabTasksProps {
  initialTasks?: {
    id?: string;
    text: string;
    completed: boolean;
    order?: number;
  }[];
}

export interface RehabTasksRef {
  getTasks: () => { text: string; completed: boolean }[];
  setTasks: (tasks: Task[]) => void;
}

const RehabTasks = forwardRef<RehabTasksRef, RehabTasksProps>(
  ({ initialTasks = [] }, ref) => {
    const [tasks, setTasks] = useState<Task[]>(
      initialTasks.length > 0
        ? initialTasks.map((task, index) => ({
            id: task.id || `task-${index}`,
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
      setTasks: (newTasks) => setTasks(newTasks),
    }));

    const addTask = () => {
      setTasks((prev) => [
        ...prev,
        { id: `task-${prev.length}`, text: "", completed: false },
      ]);
    };

    const updateTask = (id: string, newText: string) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
      );
    };

    const toggleTask = (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    };

    const removeTask = (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const handleKeyDown = (
      e: KeyboardEvent<HTMLInputElement>,
      taskId: string,
      isLastTask: boolean
    ) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission

        const currentTask = tasks.find((task) => task.id === taskId);

        // Only add new task if current task has content
        if (currentTask?.text.trim() && isLastTask) {
          addTask();
          // Focus the new input after React re-renders
          setTimeout(() => {
            const inputs = document.querySelectorAll("[data-rehab-task-input]");
            (inputs[inputs.length - 1] as HTMLInputElement)?.focus();
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
                data-rehab-task-input
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
  }
);

RehabTasks.displayName = "RehabTasks";

export default RehabTasks;

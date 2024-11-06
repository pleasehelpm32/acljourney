// components/journal/RehabTasks.jsx
"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

const RehabTasks = forwardRef((props, ref) => {
  const [tasks, setTasks] = useState([{ id: Date.now(), text: "" }]);

  // Expose methods to parent through ref
  useImperativeHandle(ref, () => ({
    getTasks: () =>
      tasks.map((task) => task.text).filter((text) => text.trim() !== ""),
  }));

  const addTask = () => {
    setTasks((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const updateTask = (id, newText) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label>Rehab Checklist</Label>
      {tasks.map((task) => (
        <div key={task.id} className="flex gap-2">
          <Input
            value={task.text}
            onChange={(e) => updateTask(task.id, e.target.value)}
            placeholder="Enter rehab task..."
          />
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

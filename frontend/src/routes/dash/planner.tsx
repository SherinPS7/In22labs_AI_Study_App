import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Pencil } from "lucide-react"

export const Planner = () => {
  const [tasks, setTasks] = useState([
    {
      title: "Leetcode",
      time: "8:00 AM - 9:00 AM",
      description: "Do Leetcode for an hour",
    },
  ])
  const [newTask, setNewTask] = useState({ title: "", time: "", description: "" })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleAddTask = () => {
    if (!newTask.title) return
    setTasks([...tasks, newTask])
    setNewTask({ title: "", time: "", description: "" })
  }

  const handleUpdateTask = (index: number) => {
    const updatedTasks = [...tasks]
    updatedTasks[index] = newTask
    setTasks(updatedTasks)
    setEditingIndex(null)
    setNewTask({ title: "", time: "", description: "" })
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setNewTask(tasks[index])
  }

  const handleDelete = (index: number) => {
    const updatedTasks = [...tasks]
    updatedTasks.splice(index, 1)
    setTasks(updatedTasks)
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-foreground mb-4">To Do List</h2>

      {/* Task Input Form */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
        <Input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Input
          placeholder="Time (e.g. 10 AM - 11 AM)"
          value={newTask.time}
          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
        />
        <Textarea
          placeholder="Short Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <Button
          onClick={() =>
            editingIndex !== null ? handleUpdateTask(editingIndex) : handleAddTask()
          }
          className="md:col-span-3"
        >
          {editingIndex !== null ? "Update Task" : "Add Task"}
        </Button>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task, index) => (
          <div key={index} className="rounded-xl p-4 shadow-sm border bg-muted">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <div className="flex gap-2">
                <Pencil className="w-4 h-4 cursor-pointer" onClick={() => handleEdit(index)} />
                <X className="w-4 h-4 cursor-pointer text-red-500" onClick={() => handleDelete(index)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{task.time}</p>
            <p className="text-sm mt-2">{task.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Planner

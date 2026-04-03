"use client"

import { useState } from "react"
import { Task, TaskStatus } from "@prisma/client"
import { Plus, GripVertical, CheckCircle2, Circle, Clock } from "lucide-react"
import { createTask, updateTaskStatus } from "@/actions/workspace"

type TaskWithAssignee = Task & {
  assignee: { user: { name: string | null } } | null
}

export function TaskBoard({ tasks }: { tasks: TaskWithAssignee[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const todoTasks = tasks.filter(t => t.status === "TODO")
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS")
  const doneTasks = tasks.filter(t => t.status === "DONE")

  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoadingId("new")
    try {
      await createTask(new FormData(e.currentTarget))
      setIsAdding(false)
    } finally {
      setLoadingId(null)
    }
  }

  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    setLoadingId(taskId)
    try {
      await updateTaskStatus(taskId, newStatus)
    } finally {
      setLoadingId(null)
    }
  }

  const Column = ({ title, status, items, icon: Icon, color }: any) => (
    <div className="flex-1 min-w-[320px] max-w-[400px] bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-4 flex flex-col h-[600px] shadow-lg shrink-0">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-white flex items-center gap-2 text-sm text-lg">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
          <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 py-0.5 px-2.5 rounded-full text-xs font-bold shadow-sm">
            {items.length}
          </span>
        </h3>
        {status === "TODO" && (
          <button 
            onClick={() => setIsAdding(true)}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {status === "TODO" && isAdding && (
          <form onSubmit={handleCreateTask} className="bg-zinc-950 border-2 border-indigo-500 rounded-xl p-3 shadow-xl mb-3">
            <input 
              name="title" 
              autoFocus
              placeholder="Task name..."
              className="w-full bg-transparent border-none text-base text-white focus:outline-none placeholder-zinc-500 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="text-xs px-3 py-1.5 text-zinc-300 hover:text-white bg-zinc-800 rounded-md border border-zinc-700"
              >
                Cancel
              </button>
              <button 
                disabled={loadingId === "new"}
                type="submit" 
                className="text-xs px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-md disabled:opacity-50 shadow-md"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {items.map((task: TaskWithAssignee) => (
          <div 
            key={task.id} 
            className={`bg-zinc-800 border-2 border-zinc-600 rounded-xl p-4 shadow-md hover:border-zinc-400 hover:shadow-xl transition-all cursor-default ${loadingId === task.id ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-base text-white font-semibold leading-snug">{task.title}</p>
              <button className="text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing shrink-0 hidden group-hover:block bg-zinc-700 p-1 rounded-md">
                <GripVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {task.assignee ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold border-2 border-indigo-500/40 shadow-inner">
                    {task.assignee.user?.name?.[0].toUpperCase() || 'U'}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-zinc-500 bg-zinc-900 flex items-center justify-center text-zinc-400 text-sm font-bold">
                    ?
                  </div>
                )}
              </div>
              
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                className="bg-zinc-900 border-2 border-zinc-600 rounded-lg py-1.5 px-3 text-xs font-bold text-zinc-200 hover:text-white hover:border-zinc-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
        ))}

        {items.length === 0 && !isAdding && (
          <div className="h-24 flex items-center justify-center text-sm font-medium text-zinc-500 border-2 border-dashed border-zinc-700 bg-zinc-950/50 rounded-xl">
            No tasks here
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <Column title="To Do" status="TODO" items={todoTasks} icon={Circle} color="text-zinc-400" />
      <Column title="In Progress" status="IN_PROGRESS" items={inProgressTasks} icon={Clock} color="text-blue-400" />
      <Column title="Done" status="DONE" items={doneTasks} icon={CheckCircle2} color="text-emerald-400" />
    </div>
  )
}

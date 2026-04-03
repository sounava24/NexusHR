"use client"

import { useRef, useEffect } from "react"
import { Message } from "@prisma/client"
import { Send, Hash } from "lucide-react"
import { sendMessage } from "@/actions/workspace"

type MessageWithSender = Message & {
  sender: { user: { name: string | null } }
}

export function TeamChat({ messages, currentUserId }: { messages: MessageWithSender[], currentUserId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    
    // Optimistic UI could be added here, but for simplicity we rely on revalidatePath
    await sendMessage(new FormData(form))
    form.reset()
  }

  return (
    <div className="flex flex-col h-[600px] bg-zinc-900 border-2 border-zinc-700 rounded-2xl overflow-hidden relative shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b-2 border-zinc-700 bg-zinc-800 flex items-center gap-3 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center border-2 border-violet-500/30">
          <Hash className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">Department Chat</h3>
          <p className="text-xs font-medium text-violet-300">Real-time collaboration</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
            <MessageSquareIcon className="w-8 h-8 opacity-50" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.senderId === currentUserId;
            // Extremely simple grouping check for margin
            const preventCollapse = i > 0 && messages[i - 1].senderId === msg.senderId
            
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${preventCollapse ? 'mt-1' : 'mt-4'}`}
              >
                {!preventCollapse && (
                  <span className="text-xs text-zinc-500 mb-1 px-1">
                    {isMe ? 'You' : msg.sender.user?.name || 'Unknown'}
                  </span>
                )}
                <div 
                  className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-md font-medium ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-zinc-800 text-white rounded-bl-none border border-zinc-700'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900 border-t-2 border-zinc-700">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            name="content"
            type="text"
            required
            autoFocus
            autoComplete="off"
            placeholder="Type your message..."
            className="w-full bg-zinc-950 border-2 border-zinc-600 text-white placeholder-zinc-500 font-medium rounded-full pl-6 pr-14 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
          />
          <button 
            type="submit"
            className="absolute right-2.5 w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  )
}

function MessageSquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import socketService from "../services/socket"

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef(null)
  
  const { userType, studentName } = useSelector((state) => state.user)

  useEffect(() => {
    const socket = socketService.getSocket()
    
    if (socket) {
      // Get chat history when opening
      if (isOpen) {
        socket.emit("get-chat-history")
      }

      socket.on("chat-history", (history) => {
        setMessages(history)
      })

      socket.on("new-message", (message) => {
        setMessages(prev => [...prev, message])
      })

      return () => {
        socket.off("chat-history")
        socket.off("new-message")
      }
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const socket = socketService.getSocket()
    const senderName = userType === "teacher" ? "Teacher" : studentName || "Student"
    
    socket.emit("send-message", {
      message: newMessage.trim(),
      senderName,
      senderType: userType
    })

    setNewMessage("")
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  if (!isOpen) {
    return (
      <button className="chat-toggle" onClick={toggleChat}>
        💬
      </button>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Chat</span>
        <button 
          onClick={toggleChat}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}
        >
          ×
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6e6e6e', margin: '20px 0' }}>
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.senderType === userType ? "own" : "other"
              }`}
            >
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
                {message.senderName}
              </div>
              <div>{message.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="chat-send-button">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat

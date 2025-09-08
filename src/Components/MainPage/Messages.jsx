import React, { useEffect, useState, useRef, useContext } from "react";
import { apiClient } from "../../apiClient";
import toast from "react-hot-toast";
import { UserData } from "../../App";
import { ArrowLeft, Check, CheckCheck } from "lucide-react";

const Messages = ({ initialUser }) => {
  const userData = useContext(UserData);
  const userId = userData?.details?.id;

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initialUser || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const messageQueueRef = useRef(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversations
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await apiClient(
          "/messages/get_conversations/",
          // "http://localhost:8000/messages/get_conversations/",
          "GET"
        );
        setConversations(res || []);
      } catch {
        toast.error("Failed to load conversations");
      }
    }
    fetchConversations();
  }, []);

  // Fetch messages when user selected
  useEffect(() => {
    if (!selectedUser) return;

    async function fetchMessages() {
      try {
        const res = await apiClient(
          `/messages/${selectedUser.conversationId}/`,
          // `http://localhost:8000/messages/${selectedUser.conversationId}/`,
          "GET"
        );

        const normalized = res.map((msg) => ({
          id: msg.id,
          text: msg.text,
          created_at: msg.created_at,
          sender_is_self: msg.sender.id === userId,
          is_read: msg.is_read ?? false,
        }));

        setMessages(normalized);
        scrollToBottom();
      } catch {
        toast.error("Failed to load messages");
      }
    }
    fetchMessages();

    // Setup WebSocket
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat/${selectedUser.conversationId}/`
    );

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Check if we've already processed this message
      if (messageQueueRef.current.has(data.id || data.timestamp)) {
        return;
      }

      // Add to processed messages
      if (data.id) messageQueueRef.current.add(data.id);
      if (data.timestamp) messageQueueRef.current.add(data.timestamp);

      setMessages((prev) => {
        if (data.sender_id === userId) {
          // Replace optimistic message with real one
          return prev.map((msg) =>
            msg.pending && msg.text === data.message
              ? {
                ...msg,
                id: data.id,
                created_at: data.created_at
                  ? new Date(data.created_at).toISOString()
                  : new Date().toISOString(), // fallback
                pending: false,
              }
              : msg
          );
        } else {
          return [
            ...prev,
            {
              id: data.id,
              text: data.message,
              sender_is_self: false,
              created_at: data.created_at
                ? new Date(data.created_at).toISOString()
                : new Date().toISOString(), // fallback
              is_read: true,
            },
          ];
        }
      });

      scrollToBottom();
    };
    ws.onclose = () => console.log("WebSocket disconnected");

    wsRef.current = ws;
    return () => ws.close();
  }, [selectedUser, userId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || isSending) return;

    setIsSending(true);
    const tempId = Date.now(); // Generate a temporary ID for optimistic UI

    // Optimistic UI update
    const optimisticMessage = {
      id: tempId,
      text: newMessage,
      sender_is_self: true,
      created_at: new Date().toISOString(),
      is_read: false,
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    scrollToBottom();

    const messageData = {
      message: newMessage,
      sender_id: userId,
    };

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Add to processed messages to prevent duplicates
        messageQueueRef.current.add(tempId);
        wsRef.current.send(JSON.stringify(messageData));
      } else {
        // Fallback to API if WebSocket is not available
        const response = await apiClient(
          // `http://localhost:8000/messages/${selectedUser.conversationId}/`,
          `/messages/${selectedUser.conversationId}/`,
          "POST",
          messageData
        );

        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map(msg =>
            msg.id === tempId
              ? { ...response, sender_is_self: true }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove the optimistic message if sending failed
      setMessages((prev) => prev.filter(msg => msg.id !== tempId));
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen ">
      <div
        className={`${selectedUser ? "hidden lg:flex" : "flex"
          } w-full lg:w-[27%] flex-col border-r border-gray-200 h-full overflow-y-auto  p-4`}
      >
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        {conversations.length === 0 ? (
          <p className="">No conversations yet.</p>
        ) : (
          <ul>
            {conversations.map((conv) => {
              const otherUser = conv.participants.find((p) => p.id !== userId);

              return (
                <li
                  key={conv.id}
                  onClick={() =>
                    setSelectedUser({
                      id: otherUser.id,
                      name: otherUser.fullname,
                      conversationId: conv.id,
                      profilepic: otherUser.profilepic,
                    })
                  }
                  className={`cursor-pointer p-3 mb-2 rounded-xl flex items-center gap-3  transition-all ${selectedUser?.conversationId === conv.id
                    ? "bg-blue-500 text-white"
                    : ""
                    }`}
                >
                  <img
                    src={otherUser.profilepic}
                    alt={otherUser.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold  truncate">
                      {otherUser.fullname}
                    </p>
                    <p className="text-sm  truncate">
                      {conv.last_message || "No messages yet"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Chat Section - Hidden on mobile when no conversation selected */}
      <div className={`${selectedUser ? "flex" : "hidden lg:flex"} flex-1 flex-col h-full`}>
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <button
                className="lg:hidden p-2 rounded-full hover:bg-gray-100"
                onClick={() => setSelectedUser(null)}
              >
                <ArrowLeft size={20} />
              </button>
              <img
                src={selectedUser.profilepic}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold  truncate">
                  {selectedUser.name}
                </h2>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3  flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className=" text-center">
                    Start the conversation by sending a message.
                  </p>
                </div>
              ) : (
                messages.map((msg,index) => (
                  <div
                    key={msg.id || index}
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${msg.sender_is_self
                      ? "bg-blue-500 text-white self-end rounded-br-none"
                      : "bg-gray-200 text-black self-start rounded-bl-none"
                      }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className={`text-xs ${msg.sender_is_self ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 mb-12 border-t border-gray-200 ">
              <div className="flex gap-2 items-center">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={1}
                  disabled={isSending}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
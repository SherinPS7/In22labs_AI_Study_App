import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  getGroupMembers,
  getGroupStatus,
  getGroupMessages,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
} from "@/api/grp";
import { io, Socket } from "socket.io-client";

// Types
type Member = { id: number; first_name: string; last_name: string };
type Message = {
  id: number;
  message_text: string;
  sender: { id: number; first_name: string; last_name: string };
  createdAt: string;
  senderMe?: boolean;
};
type PendingRequest = {
  id: number;
  User: { first_name: string; last_name: string };
};

const SOCKET_URL = "http://localhost:3000"; // Replace with your backend

export default function GroupDetails() {
  const { id } = useParams();
  const groupId = Number(id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const [userId, setUserId] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupName, setGroupName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [highlightMemberId, setHighlightMemberId] = useState<number | null>(null);

  // Initial load
  // const fetchData = async () => {
  //   try {
  //     const [memberRes, statusRes, messageRes, pendingRes] = await Promise.all([
  //       getGroupMembers(groupId),
  //       getGroupStatus(),
  //       getGroupMessages(groupId),
  //       getJoinRequests(groupId),
  //     ]);
  //     setUserId(statusRes.userId);

  //     const groups = statusRes.groups || [];
  //     const matched = groups.find(
  //       (g: any) =>
  //         g.id === groupId ||
  //         (g.group && (g.group.id === groupId || g.group.group_id === groupId))
  //     );
  //     if (!matched) throw new Error("You're not a member of this group.");

  //     setGroupName(
  //       matched.group_name || matched.group?.group_name || matched.name || "Group"
  //     );
  //     const adminUserId = matched.created_by || matched.group?.created_by;
  //     setAdminId(adminUserId);
  //     setIsAdmin(statusRes.userId === adminUserId);

  //     setMembers(memberRes.members || []);
  //     const myId: number = statusRes.userId;
  //     setMessages(
  //       (messageRes.messages || []).map((m: Message) => ({
  //         ...m,
  //         senderMe: m.sender.id === myId,
  //       }))
  //     );
  //     setPending(pendingRes.requests || []);
  //   } catch (err: any) {
  //     toast({
  //       title: "Access Denied",
  //       description: err?.message || "Unable to fetch group details.",
  //       variant: "destructive",
  //     });
  //   }
  // };
const fetchData = async () => {
  try {
    const [memberRes, statusRes, messageRes, pendingRes] = await Promise.all([
      getGroupMembers(groupId),
      getGroupStatus(),
      getGroupMessages(groupId),
      getJoinRequests(groupId),
    ]);
    setUserId(statusRes.userId);

    const groups = statusRes.groups || [];
    const matched = groups.find(
      (g: any) =>
        g.id === groupId ||
        (g.group && (g.group.id === groupId || g.group.group_id === groupId))
    );
    if (!matched) throw new Error("You're not a member of this group.");

    setGroupName(
      matched.group_name ||
        matched.group?.group_name ||
        matched.name ||
        "Group"
    );

    const adminUserId = matched.created_by || matched.group?.created_by;
    setAdminId(adminUserId);
    setIsAdmin(statusRes.userId === adminUserId);

    // ---- Members FIX: Normalize shape ----
    const rawMembers = memberRes.members || [];
    const normalizedMembers = rawMembers.map((m: any) => {
      if (m.first_name && m.last_name) {
        return m; // Already flat
      }
      if (m.User) {
        return {
          id: m.User.id,
          first_name: m.User.first_name,
          last_name: m.User.last_name,
        };
      }
      return m; // fallback
    });
    setMembers(normalizedMembers);

    // ---- Messages ----
    const myId: number = statusRes.userId;
    setMessages(
      (messageRes.messages || []).map((m: Message) => ({
        ...m,
        senderMe: m.sender.id === myId,
      }))
    );

    setPending(pendingRes.requests || []);
  } catch (err: any) {
    toast({
      title: "Access Denied",
      description: err?.message || "Unable to fetch group details.",
      variant: "destructive",
    });
  }
};

  // Socket setup for live messages
  useEffect(() => {
    fetchData();
    // Setup socket only after getting groupId, userId set
    if (!groupId) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socket.emit("joinGroup", groupId);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          senderMe: msg.sender?.id === userId,
        },
      ]);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [groupId, userId]);

  // Send via socket (real-time)
  const handleSend = async () => {
    if (!newMessage.trim() || !userId) return;
    if (!socketRef.current) {
      toast({
        title: "No connection",
        description: "Unable to send message, socket not connected.",
        variant: "destructive",
      });
      return;
    }
    // Emit message (server saves and emits back the newMessage event)
    socketRef.current.emit("groupMessage", {
      groupId,
      userId,
      message: newMessage,
    });
    setNewMessage("");
  };

  const handleApprove = async (reqId: number) => {
    try {
      await approveJoinRequest(groupId, reqId);
      toast({ title: "Approved", description: "User approved successfully." });
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to approve user.",
        variant: "destructive",
      });
    }
  };
  const handleReject = async (reqId: number) => {
    try {
      await rejectJoinRequest(reqId);
      toast({ title: "Rejected", description: "User request rejected." });
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to reject request.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-[#101513] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* --- Header --- */}
      <header className="bg-[#1f2c27] px-6 py-4 border-b border-gray-800 flex items-center justify-start">
        <h1 className="text-xl font-bold truncate">{groupName}</h1>
      </header>

      {/* --- Sidebar + Chat Main --- */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Fixed Sidebar */}
        <aside className="flex flex-col w-[380px] min-w-[240px] border-r border-gray-800 bg-[#161c1a]">
          {/* Members */}
          <div className="p-5 pb-2 font-semibold text-base border-b border-gray-800">
            Members
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-800">
            {members.map((m) => {
              const isMe = m.id === userId;
              const isMemberAdmin = m.id === adminId;
              let extra = "";
              if (isMe && isMemberAdmin) extra = " (me, admin)";
              else if (isMe) extra = " (me)";
              else if (isMemberAdmin) extra = " (admin)";
              return (
                <li
                  key={m.id}
                  className={`px-5 py-3 cursor-pointer hover:bg-green-900/50 ${
                    highlightMemberId === m.id ? "bg-green-900/80" : ""
                  }`}
                  onClick={() => setHighlightMemberId(m.id)}
                >
                  {m.first_name} {m.last_name}
                  <span className="text-sm font-semibold text-yellow-400">{extra}</span>
                </li>
              );
            })}
          </ul>
          {/* Join Requests (all can see, only admin has buttons) */}
          <div>
            <div className="pt-5 pb-2 px-5 font-semibold text-base border-t border-gray-800 bg-[#191e1a]">
              Join Requests
            </div>
            {pending.length > 0 ? (
              <ul className="divide-y divide-gray-800 bg-[#191e1a] overflow-y-auto max-h-[180px]">
                {pending.map((p) => (
                  <li key={p.id} className="px-5 py-3 flex items-center justify-between">
                    <span className="text-sm">{p.User.first_name} {p.User.last_name}</span>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" onClick={() => handleApprove(p.id)}>✔</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(p.id)}>✘</Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 px-5 py-3 bg-[#191e1a]">No join requests.</div>
            )}
          </div>
        </aside>

        {/* Chat */}
        <main className="flex-1 flex flex-col bg-[#101513] min-h-0">
          {/* Message List */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.senderMe ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl p-3 max-w-lg break-words
                  ${msg.senderMe
                    ? "bg-green-200 text-green-900"
                    : "bg-white text-gray-900"
                  }
                `}>
                  <span className="block font-semibold text-xs mb-1">
                    {msg.sender.first_name} {msg.sender.last_name}
                  </span>
                  <p className="text-sm">{msg.message_text}</p>
                  <span className="block mt-1 text-gray-500 text-[10px] text-right">
                    {format(new Date(msg.createdAt), 'p, MMM dd')}
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
          {/* Message Input */}
          <div className="border-t border-gray-800 px-6 py-5 flex gap-2 bg-[#181f1b]">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="bg-[#2a3931] text-white border-none focus:ring-0 focus:outline-none"
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
              Send
            </Button>
          </div>
        </main>
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Message = {
  id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load the guestbook, newest first, once on mount.
  useEffect(() => {
    supabase
      .from("messages")
      .select("id, user_id, author_name, body, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages(data ?? []));
  }, []);

  return (
    <div>
      <p className="mt-2 text-sm text-gray-500">
        Anyone can read the guestbook below. Sign-in is coming next.
      </p>

      <ul className="mt-6 space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{message.author_name}</h2>
              <span className="text-sm text-gray-500">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{message.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

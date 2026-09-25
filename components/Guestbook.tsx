"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Message = {
  id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export default function Guestbook() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Keep track of whether anyone is signed in, and react to sign-in/out.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession),
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Load the guestbook, newest first, once on mount.
  useEffect(() => {
    supabase
      .from("messages")
      .select("id, user_id, author_name, body, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages(data ?? []));
  }, []);

  function signIn() {
    supabase.auth.signInWithOAuth({
      // auth-js's Provider type only lists Supabase's built-in providers, so
      // a custom OIDC provider like ours needs a cast to satisfy it.
      provider: "custom:devdogsuga" as never,
      options: { redirectTo: window.location.origin + "/guestbook" },
    });
  }

  function signOut() {
    supabase.auth.signOut();
  }

  return (
    <div>
      {session ? (
        <button
          onClick={signOut}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={signIn}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Sign in with DevDogs
        </button>
      )}

      <p className="mt-2 text-sm text-gray-500">
        Anyone can read the guestbook below. Posting is coming next.
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

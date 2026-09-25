"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Message = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  // Embedded from public.profiles via the messages -> profiles foreign key.
  // messages.user_id -> profiles.id is many-to-one, so PostgREST returns a
  // single object here (or null) -- never an array.
  profiles: { name: string } | null;
};

export default function Guestbook() {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");

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
      .select("id, user_id, body, created_at, profiles(name)")
      .order("created_at", { ascending: false })
      // Without generated database types, supabase-js guesses `profiles` is
      // an array; a many-to-one embed is actually a single object, so we
      // tell it the real shape here.
      .overrideTypes<Message[], { merge: false }>()
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!session || body.trim() === "") {
      return;
    }

    // The name is looked up server-side from public.profiles (set once, at
    // sign-up) -- we never send it from the client, so no one can post
    // under a name that isn't theirs.
    const { data, error } = await supabase
      .from("messages")
      .insert({ body: body.trim() })
      .select("id, user_id, body, created_at, profiles(name)")
      .single()
      // Same reasoning as the list query above -- this is a single row, and
      // its embedded profile is a single object, not an array.
      .overrideTypes<Message, { merge: false }>();

    if (!error && data) {
      setMessages([data, ...messages]);
      setBody("");
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) {
      setMessages(messages.filter((message) => message.id !== id));
    }
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

      {session && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Leave a message"
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <button
            type="submit"
            className="self-start rounded-lg bg-black px-4 py-2 text-white"
          >
            Sign the guestbook
          </button>
        </form>
      )}

      {!session && (
        <p className="mt-2 text-sm text-gray-500">
          Sign in to leave a message. Anyone can read the guestbook below.
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{message.profiles?.name ?? "Unknown"}</h2>
              <span className="text-sm text-gray-500">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{message.body}</p>
            {session?.user.id === message.user_id && (
              <button
                onClick={() => handleDelete(message.id)}
                className="mt-2 text-sm text-red-600"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

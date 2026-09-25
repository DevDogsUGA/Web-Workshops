"use client";

import { useState } from "react";

type Entry = {
  name: string;
  message: string;
  postedAt: Date;
};

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Reject empty entries (after trimming whitespace).
    if (name.trim() === "" || message.trim() === "") {
      return;
    }

    const newEntry: Entry = {
      name: name.trim(),
      message: message.trim(),
      postedAt: new Date(),
    };

    // Newest entries show up first.
    setEntries([newEntry, ...entries]);
    setName("");
    setMessage("");
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="rounded-lg border border-gray-300 px-3 py-2"
        />
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
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

      <p className="mt-2 text-sm text-gray-500">
        Entries live only in this browser tab. Refreshing the page clears them.
      </p>

      <ul className="mt-6 space-y-4">
        {entries.map((entry, index) => (
          <li key={index} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{entry.name}</h2>
              <span className="text-sm text-gray-500">
                {entry.postedAt.toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{entry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

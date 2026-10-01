import Guestbook from "../../components/Guestbook";

export default function GuestbookPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Guestbook</h1>
      <p className="mt-4 text-gray-600">Sign in and leave a note for the next visitor.</p>
      <div className="mt-6">
        <Guestbook />
      </div>
    </div>
  );
}

import Link from "next/link";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      <ul>
        <li><Link href="https://github.com/your-handle">GitHub</Link></li>
        <li><Link href="/about/moreAbout">Even More About Me</Link></li>
      </ul>
      <section className="flex-1">{children}</section>
    </div>
  );
}

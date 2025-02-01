import Link from 'next/link'
export default function Header() {
  return (
    <div className="p-4 flex justify-between items-center">
      <Link href="/">
        <h2 className="text-lg font-bold">doc</h2>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/">Home</Link>
        <Link href="/">Slots</Link>
      </div>
    </div>
  )
}

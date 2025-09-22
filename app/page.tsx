import Post from "@/components/Post";

export default function Blog() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <h1 className="text-4xl font-bold">Welcome to Root Page</h1> */}
      <Post />
    </main>
  )
}
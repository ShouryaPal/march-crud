import { UserList } from "@/components/UserList";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">JSONPlaceholder CRUD App</h1>
      <UserList />
    </div>
  );
}

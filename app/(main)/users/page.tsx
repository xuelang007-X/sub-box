import { HydrateClient } from "@/server/api/trpc-server";
import { api } from "@/server/api/trpc-server";
import { UserTable } from "./user-table";

export default async function UsersPage() {
  const users = await api.user.getAll();
  const subconverters = await api.subconverter.getAll();

  return (
    <div className="container mx-auto py-10">
      <HydrateClient>
        <UserTable users={users} subconverters={subconverters} />
      </HydrateClient>
    </div>
  );
}

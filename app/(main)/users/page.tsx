import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HydrateClient } from "@/server/api/trpc-server";
import { api } from "@/server/api/trpc-server";
import { UserTable } from "./user-table";
import { CreateUserDialog } from "./create-user-dialog";

export default async function UsersPage() {
  const users = await api.user.getAll();
  const subconverters = await api.subconverter.getAll();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <CardTitle>用户管理 ({users.length})</CardTitle>
          <HydrateClient>
            <CreateUserDialog subconverters={subconverters} />
          </HydrateClient>
        </div>
      </CardHeader>
      <CardContent>
        <HydrateClient>
          <UserTable users={users} subconverters={subconverters} />
        </HydrateClient>
      </CardContent>
    </Card>
  );
}

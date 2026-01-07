"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UsersTable } from "@/components/features/sudo/UsersTable";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, UserCog, UserCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the shape of our user data
type User = {
    _id: Id<"users">;
    name: string;
    email: string;
    role: "sudo" | "partner" | "advisor";
    avatarUrl?: string;
    _creationTime: number;
};

export default function UsersPage() {
  const users = useQuery(api.queries.getUsers);
  const updateUserRole = useMutation(api.mutations.updateUserRole);

  const handleRoleChange = async (userId: Id<"users">, newRole: string) => {
    try {
      await updateUserRole({ 
        userId, 
        role: newRole as "sudo" | "partner" | "advisor" 
      });
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const colorMap = {
            sudo: "bg-purple-500/15 text-purple-700 dark:text-purple-400 hover:bg-purple-500/25 border-purple-200",
            partner: "bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-blue-200",
            advisor: "bg-slate-500/15 text-slate-700 dark:text-slate-400 hover:bg-slate-500/25 border-slate-200"
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Badge 
                        variant="outline" 
                        className={cn("cursor-pointer transition-colors px-2.5 py-0.5 text-[11px] uppercase font-semibold", colorMap[role])}
                    >
                        {role}
                    </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleRoleChange(row.original._id, "sudo")}>
                        <Shield className="w-4 h-4 mr-2 text-purple-500" /> Sudo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(row.original._id, "partner")}>
                         <UserCheck className="w-4 h-4 mr-2 text-blue-500" /> Partner
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(row.original._id, "advisor")}>
                         <UserCog className="w-4 h-4 mr-2 text-slate-500" /> Advisor
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
      },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: () => (
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Active</span>
            </div>
        )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("View profile coming soon")}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Deactivate User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Team Members</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage access roles and permissions.</p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" size="sm" onClick={() => toast.success("Synced with Clerk")}>
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Sync Clerk
             </Button>
             <Button size="sm" onClick={() => toast.info("Invite feature coming soon")}>
                Invite Member
             </Button>
        </div>
      </div>

      <div className="flex-1">
        {users ? (
             <UsersTable columns={columns} data={users as User[]} />
        ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Loading team directory...
            </div>
        )}
      </div>
    </div>
  );
}
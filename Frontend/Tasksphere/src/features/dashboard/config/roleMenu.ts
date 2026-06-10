import { GoOrganization } from "react-icons/go";
import { LuFolderKanban, LuLayoutDashboard, LuUsers } from "react-icons/lu";
import { MdOutlineTaskAlt } from "react-icons/md";

export const roleMenu: Record<string, any[]> = {
  SUPER_ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Organizations", path: "/dashboard/organizations", icon: GoOrganization },
    { label: "Users", path: "/dashboard/users", icon: LuUsers },
    { label: "Projects", path: "/dashboard/projects", icon: LuFolderKanban },
    { label: "Tasks", path: "/dashboard/tasks", icon: MdOutlineTaskAlt }
  ],
  OWNER: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Users", path: "/dashboard/users", icon: LuUsers },
    { label: "Projects", path: "/dashboard/projects", icon: LuFolderKanban },
    { label: "Tasks", path: "/dashboard/tasks", icon: MdOutlineTaskAlt }
  ],
  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Users", path: "/dashboard/users", icon: LuUsers },
    { label: "Projects", path: "/dashboard/projects", icon: LuFolderKanban },
    { label: "Tasks", path: "/dashboard/tasks", icon: MdOutlineTaskAlt },
  ],
  MEMBER: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Tasks", path: "/dashboard/tasks", icon: MdOutlineTaskAlt }
  ]
};
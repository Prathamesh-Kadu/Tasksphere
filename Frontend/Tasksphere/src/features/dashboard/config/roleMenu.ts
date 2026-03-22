import { GoOrganization } from "react-icons/go";
import { LuFolderKanban, LuLayoutDashboard, LuUsers } from "react-icons/lu";
import { MdOutlineTaskAlt } from "react-icons/md";

export const roleMenu: Record<string, any[]> = {
  SUPER_ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Organizations", path: "/organizations", icon: GoOrganization },
    { label: "Users", path: "/users", icon: LuUsers },
    { label: "Projects", path: "/projects", icon: LuFolderKanban },
    { label: "Tasks", path: "/tasks", icon: MdOutlineTaskAlt }
  ],
  OWNER: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Projects", path: "/projects", icon: LuFolderKanban },
    { label: "Users", path: "/users", icon: LuUsers },
    { label: "Tasks", path: "/tasks", icon: MdOutlineTaskAlt }
  ],
  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Projects", path: "/projects", icon: LuFolderKanban },
    { label: "Tasks", path: "/tasks", icon: MdOutlineTaskAlt },
    { label: "Users", path: "/users", icon: LuUsers }
  ],
  MEMBER: [
    { label: "Dashboard", path: "/dashboard", icon: LuLayoutDashboard },
    { label: "Tasks", path: "/tasks", icon: MdOutlineTaskAlt }
  ]
};
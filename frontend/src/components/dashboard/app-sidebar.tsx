import {Book, ChartArea, CircleDollarSignIcon, Hourglass, Notebook, NotebookPen, Users } from "lucide-react"
const Logo = '/dark1-logo.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { ModeToggle } from "./mode-toggle";
import ProfileDialog from "./profile-dialog";
import LogoutDialog from "./logout-dialog";
import { GoogleCalendarIcon } from "./google-calendar-icon";
import { NotionIcon } from "./notion-icon";

// Menu items.
const overview = [
  {
    title: "Overview",
    url: "/overview",
    icon: ChartArea,
  },
  {
    title: "Feature Selection",
    url: "/feature-selection",
    icon: ChartArea,
  },
];

const app = [
    {
      title : "Learn",
      url : "/learn",
      icon : Book
    },
    {
      title : "Schedule",
      url : "/schedule",
      icon : Hourglass
    },
    {
        title : "Tests",
        url : "/rooms",
        icon : NotebookPen
    }
];

const integrations = [
    {
      title : "Google Calendar",
      url : "/connect-gcalendar",
      icon : GoogleCalendarIcon
  },{
    title : "Notion",
    url : "/connect-notion",
    icon : NotionIcon
  }
]

// const billing = [
//     {
//         title : "Billing",
//         url : "/billing",
//         icon : CircleDollarSignIcon
//     }
// ]

const community = [
  {
    title : "My Learnings",
    url : "/mylearnings",
    icon : Notebook
  }


]

export function AppSidebar() {
  return (
    <Sidebar>
        <SidebarHeader>
            <Link to={"/"} className='flex flex-row gap-1 items-center'>
                <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
                <h1 className='text-xl font-semibold text-foreground tracking-tight'>Study App</h1>
            </Link>
        </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overview.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            {/* <SidebarMenu>
              {app.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>COURSES</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {community.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Integrations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {integrations.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Payments</SidebarGroupLabel> */}
          <SidebarGroupContent>
            {/* <SidebarMenu>
              {billing.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu> */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center gap-2">
        <ModeToggle />
        <ProfileDialog />
        <LogoutDialog />
      </SidebarFooter>
    </Sidebar>
  )
}

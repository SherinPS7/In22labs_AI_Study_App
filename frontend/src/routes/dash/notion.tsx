import { NotionIcon } from "@/components/dashboard/notion-icon"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Notion = () => {
  return (
    <div className="w-full p-4">
        <main className="flex justify-start md:justify-between items-start md:items-center flex-col md:flex-row gap-4 flex-wrap">
            <main className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                    Integrations - Notion
                </h1>
                <p className="text-muted-foreground text-sm font-light tracking-tight leading-tight">
                   Connect with Notion to make your learning experience much more faster and efficient
                </p>
            </main>

            <div className="relative">
                <Button variant={"default"} asChild className="relative" size={"sm"}>
                    <Link to={"/pricing"}>
                        <NotionIcon />
                        Connect
                    </Link>
                </Button>
            </div>
        </main>
    </div>
  )
}

export default Notion
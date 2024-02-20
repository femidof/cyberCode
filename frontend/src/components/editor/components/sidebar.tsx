import { ReactNode } from "react"

export const Sidebar = ({children}: { children: ReactNode }) => {
    return (
      <div className="w-3/5 h-full border-r-2 border-solid border-blue-950 pt-3" >
        {children}
      </div>
    )
  }
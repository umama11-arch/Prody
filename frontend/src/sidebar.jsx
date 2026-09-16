import React from 'react'
// import { useState } from 'react'
import "./App.css"
const Sidebar = ({tasks,setFilter,setPage,setShowModal,signout,dark,setDark}) => {

  return (
    <div className={`sidebar ${dark ? "dark" : "light"}`}>


          <h2 className='taskflowheading'>TaskFlow</h2>
<button className='sidebarbtn' onClick={()=>{setPage("task")}}>Dashboard</button>
<button className='sidebarbtn' onClick={() => setFilter("all")}>
  All Tasks
</button>
<button className='sidebarbtn' onClick={() => setFilter("completed")}>
  Completed
</button>
<button className='sidebarbtn' onClick={() => setFilter("pending")}>
  Pending
</button>
<button className='sidebarbtn' onClick={() => setPage("analytics")}>
  Analytics
</button>
<button className='sidebarbtn' onClick={()=>{setPage("goal")}}>Goals</button>
<button className='sidebarbtn' onClick={()=>{setPage("Ai")}}>AI mentor</button>
 <button
className="theme-toggle"
onClick={() => setDark(!dark)}
>
{dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>
<button className="floating-btn" onClick={() => setShowModal(true)}>+</button>
      <button className='signout' onClick={() => { signout() }}>⏻</button>
        </div>

  )
}

export default Sidebar
import React from 'react'
import { Navbar } from '../Common/Navbar'
import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <div id="wrapper">
      <div id="main">
        <div className="inner">
            <Navbar></Navbar>
            </div>
        </div>
        </div>
  )
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import UserMenu from '../components/UserMenu'

const Dashboard = () => {
   return (
      <>
      <section>
         <div className='bg-white'>
            {/* grid lg:grid-cols-[250px, 1fr] */}
            <div className='container mx-auto p-3 flex gap-10'>
               {/* Левое меню */}
               <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
                  <UserMenu/>
               </div>

               {/* Контент */}
               <div className='bg-white w-full min-h-[75vh]'>
                  <Outlet />
               </div>
            </div>
         </div>
      </section>

      </>
   )
}

export default Dashboard
import DashboardSideBar from '@/components/DashboardSideBar';
import React from 'react';

const layout = ({children}) => {
  return (  

<div>
 <DashboardSideBar>
   <div className='px-6 py-10 max-w-6xl w-full mx-auto'>
       {children}
   </div>
 </DashboardSideBar>
  
    </div>
  );
};

export default layout;
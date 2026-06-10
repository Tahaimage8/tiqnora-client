import DashboardSideBar from '@/components/DashboardSideBar';
import React from 'react';

const layout = ({children}) => {
  return (  

<div>
 <DashboardSideBar>
      {children}
 </DashboardSideBar>
  
    </div>
  );
};

export default layout;
import React from 'react';
import TabBar from '../BottomTab/TabBar';

const MainLayout = ({ children }) => {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
};
export default MainLayout;
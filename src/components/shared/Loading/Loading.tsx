import { Spin } from 'antd';
import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 h-screen w-full flex items-center justify-center bg-primary bg-opacity-20 z-50">
      <Spin size="large" />
    </div>
  );
};

export default Loading;

import React from 'react';

const MyContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`max-w-[1352px] w-[90%] mx-auto${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
};

export default MyContainer;

'use client';
import React from 'react';
import { RiErrorWarningFill } from 'react-icons/ri';

interface EmptyStateProps {
  title?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const EmptyDataPage: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-220px)]">
      <div className="flex flex-col items-center justify-center ">
        <div className="flex flex-col items-center">
          <div className="bg-[#E4E4E4] p-4">
            <span className="text-secondary text-3xl">
              <RiErrorWarningFill color="red" size={50} />
            </span>
          </div>
          <p className="text-secondary2 mt-4 text-center text-base">{title}</p>
          {buttonText && (
            <button
              className="mt-5 md:mt-8 bg-blue-600 text-white px-5 md:px-8 py-3 text-base rounded-md hover:bg-blue-700 transition"
              type="submit"
              onClick={onButtonClick}
            >
              + {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyDataPage;

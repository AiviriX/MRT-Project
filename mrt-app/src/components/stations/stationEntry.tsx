import React from 'react';

export interface StationProps {
  name: string;
  position: [number, number];
  handleDelete: (name: string) => void;
  handleRefresh: () => void;
}

const StationEntry: React.FC<StationProps> = (props) => {
  return (
    <div className='w-full flex justify-between items-center border-y-4 '>
      <div className='mx-4 my-4 flex flex-col'>
        <span>Name: {props.name}</span>
        <span>Position: {props.position.join(', ')}</span>
      </div>

      <div className='flex flex-col'>
        <button onClick={() => props.handleDelete(props.name)}>Delete</button>
        <button onClick={props.handleRefresh}>Refresh</button>
      </div>
    </div>
  );
};

export default StationEntry;
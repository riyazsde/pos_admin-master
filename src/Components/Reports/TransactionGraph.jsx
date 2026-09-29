import React from 'react';
import { User } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import profileAvatar from '../../assets/Images/admin/Dashboard/Vector.png';

const TransactionGraph = () => {
  const data = [
    { name: 'Used', value: 50 },
    { name: 'Remaining', value: 50 },
  ];

  const COLORS = ['url(#grad1)', '#E5E7EB'];

  return (
    <div className=" w-full">
      <h2 className="text-[24px] font-bold text-[#000000] poppins-text">
        Transaction Graph <span className="text-sm font-normal text-gray-500 mt-5">(Report)</span>
      </h2>


      <div className='bg-white shadow-md rounded-2xl py-7 px-4'>
      <div className="mt-4">
        <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
        <p className="text-2xl font-bold text-[#941C93]">6 092 XOF</p>
        <p className="text-sm mt-1 text-gray-700">
          You have Spent <span className="text-green-600 font-semibold">32%</span> Lesser than Last Month
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="relative w-[200px] h-[180px]">
          <PieChart width={200} height={200}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#DF4C4C" />
                <stop offset="100%" stopColor="#7D2AE8" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx={100}
              cy={100}
              innerRadius={65}
              outerRadius={95}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center ">
            <img src={profileAvatar} className='bg-gray-200 p-3 rounded-full'/>
            <span className="text-[24px] font-bold text-[#2E2E30] poppins-text">50%</span>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default TransactionGraph;

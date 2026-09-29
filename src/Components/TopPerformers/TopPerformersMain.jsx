import React from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png'
const TopPerformersMain = () => {
  const performersData = [
    { id: '01', company: 'AOH Bars', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
    { id: '02', company: 'Chinese Restaurant', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
    { id: '03', company: 'AOH Bars', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
    { id: '04', company: 'Chinese Restaurant', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
    { id: '05', company: 'Chinese Restaurant', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
    { id: '06', company: 'Asian Restaurant', sales: '9 9000 XOF', renewalDate: 'March 01, 2025' },
  ];

  return (
    <div className="w-full px-6 py-8 ">
      {/* Title */}
    <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-[32px]">
  <span className="text-gray-400 flex items-center gap-1 text-[32px]">
    Dashboard
    <span className="font-poppins font-bold text-[32px] leading-[120%] tracking-[0%]">
      <img src={arrow} alt="Arrow" className="w-6 h-6 inline-block" />
    </span>
  </span>
  Top Performer
</h1>


      {/* Table */}
      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gradient-to-b from-purple-900/10 to-red-600/10 border border-black/20 rounded-t-2xl h-12 items-center px-4 font-semibold text-black/60 text-base">
          <div>#</div>
          <div>Company Name</div>
          <div className="text-center">Total Sales</div>
          <div className="text-center">Renewal Date</div>
        </div>

        {/* Table Rows */}
        {performersData.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-4 border-l border-r border-b border-black/20 h-14 items-center px-4 text-base ${
              index === performersData.length - 1 ? 'rounded-b-2xl' : ''
            }`}
          >
            <div>{item.id}</div>
            <div>{item.company}</div>
            <div className="text-center text-green-500">{item.sales}</div>
            <div className="text-center text-red-500">{item.renewalDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAdminLayout(TopPerformersMain);

import React, { useMemo } from 'react';

const IndianRupeeRate = ({ rate, className = '', itemTitle = '' }) => {
  const formattedRate = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rate);
  }, [rate]);

  return (
    <span
      className={`rupee-rate ${className} font-semibold font-cinzel`}      
      title={`${itemTitle}`}
    >
      {formattedRate}
    </span>
  );
};
export default IndianRupeeRate;

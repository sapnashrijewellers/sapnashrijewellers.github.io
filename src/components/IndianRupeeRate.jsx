import React from 'react';

/**
 * Renders a rate formatted for the Indian locale (en-IN) as currency (INR) 
 * without any decimal places.
 * @param {object} props
 * @param {number} props.rate - The numerical value to be formatted and displayed.
 * @param {string} [props.className] - Optional CSS class to apply to the container element.
 */
const IndianRupeeRate = ({ rate, className = "" }) => {
  if (typeof rate !== 'number' || isNaN(rate)) {
    return <span className={className}>--</span>; 
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedRate = formatter.format(rate);

  return (
    <span className={`rupee-rate ${className}`}>
      {formattedRate}
    </span>
  );
};

export default IndianRupeeRate;

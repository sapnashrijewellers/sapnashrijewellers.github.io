import React from 'react';

/**
 * Renders a rate formatted for the Indian locale (en-IN) as currency (INR) 
 * without any decimal places.
 * * @param {object} props
 * @param {number} props.rate - The numerical value to be formatted and displayed.
 */
const IndianRupeeRate = ({ rate }) => {
  if (typeof rate !== 'number' || isNaN(rate)) {
    // Optional: Return a placeholder if the rate is invalid
    return <span>--</span>; 
  }

  // 1. Define the formatter outside the return statement for cleaner JSX
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    // Key settings to achieve no decimals
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  });

  // 2. Format the rate
  const formattedRate = formatter.format(rate);

  return (
    // You can wrap it in a span or div, depending on your layout
    <span className="rupee-rate text-green-500">
      {formattedRate}
    </span>
  );
};

export default IndianRupeeRate;
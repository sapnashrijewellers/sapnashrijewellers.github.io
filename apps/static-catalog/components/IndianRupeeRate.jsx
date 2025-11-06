import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a rate formatted for the Indian locale (en-IN) as currency (INR) 
 * without any decimal places.
 * Optimized for SSG and SEO.
 *
 * @param {object} props
 * @param {number} props.rate - The numerical value to be formatted and displayed.
 * @param {string} [props.className] - Optional CSS class to apply to the container element.
 */
const IndianRupeeRate = ({ rate, className = '' }) => {
  // Validate rate early for SEO-friendly static content
  if (typeof rate !== 'number' || isNaN(rate)) {
    return <span className={className} aria-label="Rate not available">--</span>;
  }

  // Memoize formatter for performance (avoids creating a new object each render)
  const formattedRate = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rate);
  }, [rate]);

  return (
    // Use semantic span with proper microdata for SEO
    <span
      className={`rupee-rate ${className}`}
      itemProp="price"
      itemScope
      itemType="http://schema.org/PriceSpecification"
      aria-label={`Price: ${formattedRate}`}
    >
      {formattedRate}
    </span>
  );
};

IndianRupeeRate.propTypes = {
  rate: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default IndianRupeeRate;

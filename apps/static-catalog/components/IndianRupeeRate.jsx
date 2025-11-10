import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders a rate formatted for the Indian locale (en-IN) as currency (INR) 
 * without any decimal places. 
 *
 * @param {object} props
 * @param {number} props.rate 
 * @param {string} [props.className]
 */
const IndianRupeeRate = ({ rate, className = '' }) => { 
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

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Displays an Indian Rupee rate with valid Schema.org markup
 * for 22K Gold spot price (or any product).
 *
 * @param {object} props
 * @param {number} props.rate - Price value in INR
 * @param {string} [props.itemName='Gold 22K'] - Product name
 * @param {string} [props.className] - CSS class
 */
const IndianRupeeRate = ({ rate, itemName = 'Gold 22K', className = '', itemTitle = '' }) => {
  const formattedRate = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rate);
  }, [rate]);

  return (
    <span itemScope itemType="https://schema.org/Product" className='font-cinzel text-xs text-primary font-semibold' >
      <meta itemProp="name" content={`${itemName} Spot Price`} />
      <meta
        itemProp="description"
        content={`Current spot price for ${itemName} in India`}
      />
      {itemName}
      <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <meta itemProp="priceCurrency" content="INR" />
        <meta itemProp="availability" content="https://schema.org/InStock" />
        <meta itemProp="itemCondition" content="https://schema.org/NewCondition" />

        <span
          itemProp="priceSpecification"
          itemScope
          itemType="https://schema.org/PriceSpecification"
          className={`rupee-rate ${className} font-cinzel text-sm text-normal font-normal`}
          aria-label={`Price: ${formattedRate}`}
          title={`${itemTitle}`}
        >
          <meta itemProp="price" content={rate} />
          <meta itemProp="priceCurrency" content="INR" />
          <meta itemProp="name" content={`Spot Price for ${itemName}`} />
          {formattedRate}
        </span>
      </span>
    </span>
  );
};

IndianRupeeRate.propTypes = {
  rate: PropTypes.number.isRequired,
  itemName: PropTypes.string,
  className: PropTypes.string,
};

export default IndianRupeeRate;

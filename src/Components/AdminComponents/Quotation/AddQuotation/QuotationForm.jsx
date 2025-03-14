import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WorkDetails from './WorkDetails';
import ProductDetails from './ProductDetails';

const QuotationForm = () => {
  const quotationId = useSelector(state => state.quotation.id);
  const [activeStep, setActiveStep] = useState(0);

  // Function to handle work details completion
  const handleWorkDetailsComplete = () => {
    if (quotationId) {
      setActiveStep(1); // Move to products step
    }
  };

  return (
    <div className="space-y-4">
      {/* Work Details Section */}
      <WorkDetails onComplete={handleWorkDetailsComplete} />

      {/* Products Section */}
      {quotationId ? (
        <ProductDetails optionValue={optionValue} />
      ) : (
        <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
          Please save work details before adding products
        </div>
      )}
    </div>
  );
};

export default QuotationForm; 
import React, { useState } from "react";

const PaymentForm = (props) => {
    const { handlePayment, nextButtonText } = props;
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.cardholderName) newErrors.cardholderName = "Cardholder name is required.";
    if (!formData.cardNumber || formData.cardNumber.length !== 16) newErrors.cardNumber = "Card number must be 16 digits.";
    if (!formData.expiryMonth) newErrors.expiryMonth = "Expiry month is required.";
    if (!formData.expiryYear) newErrors.expiryYear = "Expiry year is required.";
    if (!formData.cvc || formData.cvc.length !== 3) newErrors.cvc = "CVC must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handlePayment(formData);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Cardholder Name</label>
        <input
          type="text"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-sm">{errors.cardholderName}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
          maxLength={16}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-sm">{errors.cardNumber}</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium">Expiry Month</label>
          <select
            name="expiryMonth"
            value={formData.expiryMonth}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          {errors.expiryMonth && (
            <p className="text-red-500 text-sm">{errors.expiryMonth}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium">Expiry Year</label>
          <select
            name="expiryYear"
            value={formData.expiryYear}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Year</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() + i}>
                {new Date().getFullYear() + i}
              </option>
            ))}
          </select>
          {errors.expiryYear && (
            <p className="text-red-500 text-sm">{errors.expiryYear}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium">CVC</label>
          <input
            type="text"
            name="cvc"
            value={formData.cvc}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            maxLength={3}
          />
          {errors.cvc && (
            <p className="text-red-500 text-sm">{errors.cvc}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded-lg"
      >
        {nextButtonText}
      </button>
    </form>
  );
};

export default PaymentForm;

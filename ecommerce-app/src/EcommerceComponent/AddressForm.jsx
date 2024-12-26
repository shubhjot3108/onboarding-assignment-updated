import React, { useState } from "react";
import { validateAddressFormData } from "./utils";

const AddressForm = (props) => {
  const { handleSubmit, nextButtonText } = props;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
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
      const newErrors = validateAddressFormData(formData);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSubmit(formData);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium">Zipcode</label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.zipcode && (
            <p className="text-red-500 text-sm">{errors.zipcode}</p>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-medium">Country</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Country</option>
          <option value="IND">India</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country}</p>
        )}
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

export default AddressForm;

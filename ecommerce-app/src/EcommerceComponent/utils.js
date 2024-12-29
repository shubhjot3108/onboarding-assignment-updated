export const filterTypes = ["Category,Customer Rating"];

export const validateAddressFormData = (formData) => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.zipcode) newErrors.zipcode = "Zipcode is required.";
    if (!formData.country) newErrors.country = "Country is required.";

    return newErrors;
};
const addressesModel = require('../models/addresses');
const helpers = require('../helpers/helpers');

const insertAddress = async (req, res, next) => {
  try {
    const data = {
      user_id: req.userLogin.user_id,
      primary_address: req.body.primary_address,
      label: req.body.label,
      recipients_name: req.body.recipients_name,
      phone_number: req.body.phone_number,
      city_or_subdistrict: req.body.city_or_subdistrict,
      address: req.body.address,
      postal_code: req.body.postal_code,
    };
    const addressId = [];
    if (data.primary_address === '1') {
      const dataAddresses = await addressesModel.checkExistPrimaryAddress(req.userLogin.user_id, 'user_id');
      if (dataAddresses.length > 0) {
        dataAddresses.forEach((address) => addressId.push(address.address_id));
      }
    }
    const addDataAddress = await addressesModel.insertAddress(data);
    if (addDataAddress.affectedRows) {
      if (data.primary_address === '1' && addressId.length > 0) {
        await addressesModel.batchUpdateSecondaryAddresses('0', addressId);
      }
      helpers.response(res, 'Success', 200, 'Successfully added address', data);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  insertAddress,
};

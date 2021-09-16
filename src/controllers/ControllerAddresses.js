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

const readAddress = async (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'label') {
      fieldOrder = 'label';
    } else if (fieldOrder.toLowerCase() === 'recipients_name') {
      fieldOrder = 'recipients_name';
    } else if (fieldOrder.toLowerCase() === 'phone_number') {
      fieldOrder = 'phone_number';
    } else if (fieldOrder.toLowerCase() === 'city_or_subdistrict') {
      fieldOrder = 'city_or_subdistrict';
    } else if (fieldOrder.toLowerCase() === 'address') {
      fieldOrder = 'address';
    } else if (fieldOrder.toLowerCase() === 'primary_address') {
      fieldOrder = 'primary_address';
    } else {
      fieldOrder = 'address_id';
    }
  } else {
    fieldOrder = 'address_id';
  }
  try {
    let dataAddress;
    let pagination;
    const lengthRecord = Object.keys(
      await addressesModel.readAddress(req.userLogin.user_id, search, order, fieldOrder),
    ).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataAddress = await addressesModel.readAddress(req.userLogin.user_id, search, order, fieldOrder, start, limit);
      helpers.responsePagination(res, 'success', 200, 'data products', dataAddress, pagination);
    } else {
      dataAddress = await addressesModel.readAddress(req.userLogin.user_id, search, order, fieldOrder);
      helpers.response(res, 'success', 200, 'data products', dataAddress);
    }
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const checkExistAddress = await addressesModel.checkExistAddress(req.params.id, 'address_id');
    const checkRelation = await addressesModel.checkRealtion(req.params.id);
    if (checkExistAddress.length > 0) {
      // if (checkExistAddress[0].primary_address === 1 || checkExistAddress[0].primary_address === '1') {
      //   return helpers.response(res, 'failed', 409, 'Main address cannot be deleted', []);
      // }
      if (checkRelation.length === 0) {
        const removeDataAddress = await addressesModel.deleteAddress(req.params.id);
        if (removeDataAddress.affectedRows) {
          helpers.response(res, 'success', 200, 'successfully deleted address data', []);
        }
      } else if (checkRelation.length > 0) {
        helpers.response(
          res,
          'data relation',
          409,
          'address data cannot be deleted because it is related to other data',
          {},
        );
      }
    } else {
      helpers.response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const setPrimaryAddress = async (req, res, next) => {
  try {
    const checkExistAddress = await addressesModel.checkExistAddress(req.params.id, 'address_id');
    if (checkExistAddress.length > 0) {
      const addressId = [];
      const dataAddresses = await addressesModel.checkExistPrimaryAddress(req.userLogin.user_id, 'user_id');
      if (dataAddresses.length > 0) {
        dataAddresses.forEach((address) => addressId.push(address.address_id));
      }
      const updateDataAddress = await addressesModel.updateAddress({ primary_address: 1 }, req.params.id);
      if (updateDataAddress.affectedRows) {
        if (addressId.length > 0) {
          await addressesModel.batchUpdateSecondaryAddresses('0', addressId);
        }
        helpers.response(res, 'Success', 200, 'Successfully set primary address', {});
      }
    } else {
      return helpers.response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  insertAddress,
  readAddress,
  deleteAddress,
  setPrimaryAddress,
};

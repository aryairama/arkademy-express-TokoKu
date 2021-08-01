import helpers from '../helpers/helpers.js';
import colorModel from '../models/colors.js';

const readColor = async (req, res, next) => {
  const StatusPagination = req.query.pagination || 'on';
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
    if (fieldOrder.toLowerCase() === 'color_name') {
      fieldOrder = 'color_name';
    } else {
      fieldOrder = 'color_id';
    }
  } else {
    fieldOrder = 'color_id';
  }
  try {
    let dataColor;
    let pagination;
    const lengthRecord = Object.keys(await colorModel.readColor(search, order, fieldOrder)).length;
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
      if (StatusPagination === 'on') {
        dataColor = await colorModel.readColor(search, order, fieldOrder, start, limit);
        return helpers.responsePagination(res, 'success', 200, 'data color', dataColor, pagination);
      }
    }
    dataColor = await colorModel.readColor(search, order, fieldOrder);
    return helpers.response(res, 'success', 200, 'data color', dataColor);
  } catch (error) {
    next(error);
  }
};

export default {
  readColor,
};

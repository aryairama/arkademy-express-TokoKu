import categoryModel from "../models/categories.js"
import helpers from "../helpers/helpers.js";
const readCategory = async (req, res) => {
  const search = req.query.search || "";
  const order = req.query.order ? (req.query.order.toUpperCase() === "ASC" ? "ASC" : "" || req.query.order.toUpperCase() === "DESC" ? "DESC" : "") : "DESC"
  let fieldOrder = req.query.fieldOrder
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === "name") {
      fieldOrder = "name"
    } else {
      fieldOrder = "category_id";
    }
  } else {
    fieldOrder = "category_id";
  }
  try {
    let dataCategories;
    const lengthRecord = Object.keys(await categoryModel.readProduct(search, order,fieldOrder)).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      dataCategories = await categoryModel.readProduct(search,order,fieldOrder,start,limit);
    } else {
      dataCategories = await categoryModel.readProduct(search,order,fieldOrder);
    }
    helpers.response(res, "success", 200, "data categories", dataCategories);
  } catch (error) {
    console.log(error);
  }
};

const insertCategory = async (req, res) => {
  const data = {
    name: req.body["name"],
    created_at: new Date(),
    updated_at: new Date(),
  };
  try {
    const addDataCategory = await categoryModel.insertCategory(data);
    helpers.response(res, "success", 200, "successfully added category data",addDataCategory);
  } catch (error) {
    console.log(error)
  }
}

const updateCategory = async (req, res) => {
  try {
    const data = {
      name: req.body["name"],
      updated_at: new Date(),
    };
    const changeDataCategory = await categoryModel.updateCategory(data, req.params.id)
    if (changeDataCategory.affectedRows) {
      helpers.response(res,"success",200,"successfully updated category data",[])
    } else {
      helpers.response(res,"failed",404,"the data you want to change does not exist",[])
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteCategory = async (req, res) => {
  try {
    const removeDataCategory = await categoryModel.deleteCategory(req.params.id)
    if (removeDataCategory.affectedRows) {
      helpers.response(res,"success",200, "successfully deleted category data",[])
    } else {
      helpers.response(res, "failed", 404, "the data you want to delete does not exist",[]);
    }
  } catch (error) {
    console.log(error)
  }
}
export default { readCategory,insertCategory,updateCategory,deleteCategory };

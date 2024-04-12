import { asyncHandler } from "../utils/asyncHandler.js";
import { Store } from "../model/store.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const registerStore = asyncHandler(async (req, res) => {
  console.log("hello");
  const { ownername, location, storename, noofworker, stock, rating } =
    req.body;
  console.log(req.body);
  if (
    [ownername, location, storename, noofworker, rating].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedStore = await Store.findOne({ storename: storename });

  if (existedStore) {
    throw new ApiError(409, "Store with storename already exists");
  }
  const store = await Store.create({
    ownername: ownername.toLowerCase(),
    location: location.toLowerCase(),
    storename: storename.toLowerCase(),
    noofworker: noofworker,
    stock,
    rating,
  });

  const createdStore = await Store.findById(store._id);

  if (!createdStore) {
    throw new ApiError(500, "Something went wrong while registering the Store");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdStore, "Store registered Successfully"));
});

const updateStoreDetails = asyncHandler(async (req, res) => {
  const id = req.params._id;
  const updatefields = req.body;
  const store = await Store.findByIdAndUpdate(
    id,
    {
      $set: updatefields,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store details updated successfully"));
});

const getStoreDetails = asyncHandler(async (req, res) => {
  const id = req.params._id;
  console.log(id);
  const store = await Store.findById(id);
  console.log(store);
  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store details deleted successfully"));
});

const deleteStore = asyncHandler(async (req, res) => {
  const id = req.params._id;
  const store = await Store.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, store, "Store details deleted successfully"));
});

const getAllStore = asyncHandler(async (req, res) => {
  const store = await Store.find(req.query);
  if (!store) {
    throw new ApiError(500, "Something went wrong while getting the medicine");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, store, "get medicines Successfully"));
});

export {
  registerStore,
  updateStoreDetails,
  getStoreDetails,
  deleteStore,
  getAllStore,
};

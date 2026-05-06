import { Request, Response } from "express";
import Service from "../models/Service";

export async function getServices(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = req.query.category;
    const search = req.query.search;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }
const services = await Service.find(query)
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(query);

    return res.json({
      data: services,
      total,
      page,
      limit,
      hasMore: skip + services.length < total,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch services",
    });
  }
}

export async function getServiceById(req: Request, res: Response) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    return res.json(service);
  } catch (error) {
    return res.status(500).json({
      message: "Failed",
    });
  }
}
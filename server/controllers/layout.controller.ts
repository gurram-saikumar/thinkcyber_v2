import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../utils/catchAsyncError";
import Layout from "../models/layout.model";
import cloudinary from "cloudinary";
import { sequelize } from "../utils/database";

// create layout
export const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const { type } = req.body;
  const isTypeExist = await Layout.findOne({ where: { type } });
  if (isTypeExist) {
    return next(new ErrorHandler(`${type} already exist`, 400));
  }

  if (type === "Banner") {
    const { image, title, subTitle } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "layout",
    });
    const banner = {
      type: "Banner",
      banner: {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      },
    };
    await Layout.create(banner);
  }

  if (type === "FAQ") {
    const { faq } = req.body;
    const faqItems = await Promise.all(
      faq.map(async (item: any) => {
        return {
          question: item.question,
          answer: item.answer,
        };
      })
    );
    await Layout.create({ type: "FAQ", faq: faqItems });
  }

  if (type === "Categories") {
    const { categories } = req.body;
    const categoriesItems = await Promise.all(
      categories.map(async (item: any) => {
        return {
          title: item.title,
        };
      })
    );
    await Layout.create({
      type: "Categories",
      categories: categoriesItems,
    });
  }

  if (type === "Subcategories") {
    const { subcategories } = req.body;
    const subcategoriesItems = await Promise.all(
      subcategories.map(async (item: any) => {
        return {
          title: item.title,
          categoryId: item.categoryId
        };
      })
    );
    await Layout.create({
      type: "Subcategories",
      subcategories: subcategoriesItems,
    });
  }

  res.status(200).json({
    success: true,
    message: "Layout created successfully",
  });
});

// Edit layout
export const editLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const { type } = req.body;

  if (type === "Banner") {
    const bannerData: any = await Layout.findOne({ where: { type: "Banner" } });

    const { image, title, subTitle } = req.body;

    const data = image.startsWith("https")
      ? bannerData
      : await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });

    const banner = {
      type: "Banner",
      image: {
        public_id: image.startsWith("https")
          ? bannerData.banner.image.public_id
          : data?.public_id,
        url: image.startsWith("https")
          ? bannerData.banner.image.url
          : data?.secure_url,
      },
      title,
      subTitle,
    };

    await Layout.update({ banner }, { where: { id: bannerData.id } });
  }

  if (type === "FAQ") {
    const { faq } = req.body;
    const FaqItem = await Layout.findOne({ where: { type: "FAQ" } });
    const faqItems = await Promise.all(
      faq.map(async (item: any) => {
        return {
          question: item.question,
          answer: item.answer,
        };
      })
    );
    await Layout.update(
      { type: "FAQ", faq: faqItems },
      { where: { id: FaqItem?.id } }
    );
  }

  if (type === "Categories") {
    const { categories } = req.body;
    const categoriesData = await Layout.findOne({
      where: { type: "Categories" },
    });

    if (!categoriesData) {
      // If no categories exist, create new ones
      await Layout.create({
        type: "Categories",
        categories: categories.map((item: any) => ({
          title: item.title,
          _id: item._id || undefined
        })),
      });
    } else {
      // Update existing categories
      await Layout.update(
        {
          type: "Categories",
          categories: categories.map((item: any) => ({
            title: item.title,
            _id: item._id || undefined
          })),
        },
        { where: { id: categoriesData.id } }
      );
    }
  }

  if (type === "Subcategories") {
    const { subcategories } = req.body;
    const subcategoriesData = await Layout.findOne({
      where: { type: "Subcategories" },
    });

    if (!subcategoriesData) {
      // If no subcategories exist, create new ones
      await Layout.create({
        type: "Subcategories",
        subcategories: subcategories.map((item: any) => ({
          title: item.title,
          categoryId: item.categoryId,
          _id: item._id || undefined
        })),
      });
    } else {
      // Update existing subcategories
      await Layout.update(
        {
          type: "Subcategories",
          subcategories: subcategories.map((item: any) => ({
            title: item.title,
            categoryId: item.categoryId,
            _id: item._id || undefined
          })),
        },
        { where: { id: subcategoriesData.id } }
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Layout Updated successfully",
  });
});

// get layout by type
export const getLayoutByType = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure database connection
  if (!sequelize.authenticate()) {
    throw new ErrorHandler("Database connection failed", 500);
  }

  const { type } = req.params;
  const layout = await Layout.findOne({ where: { type } });
  res.status(201).json({
    success: true,
    layout,
  });
});

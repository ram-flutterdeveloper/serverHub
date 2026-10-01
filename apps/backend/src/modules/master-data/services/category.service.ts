import categoryRepository from "../repositories/category.repository";
import { AppError } from "../../../helpers/AppError";

class CategoryService {
  // async create(body: any) {
  //   const exists = await categoryRepository.findByName(body.name);

  //   if (exists) {
  //     throw new AppError("Category already exists", 400);
  //   }

  //   return categoryRepository.create({
  //     ...body,
  //     slug: body.name
  //       .toLowerCase()
  //       .replace(/\s+/g, "-"),
  //   });
  // }

   async create(
    body: any,
    file?: Express.Multer.File
  ) {

    if (!body?.name) {
      throw new AppError(
        "Category name is required",
        400
      );
    }


    // Check duplicate
    const exists =
      await categoryRepository.findByName(
        body.name.trim()
      );

    if (exists) {
      throw new AppError(
        "Category already exists",
        400
      );
    }


    // Generate slug
    const slug =
      body.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");


    // Image
    let image = null;

    if (file) {
      image =
        `/uploads/categories/${file.filename}`;
    }


    return categoryRepository.create({

      name:
        body.name.trim(),

      slug,

      image,

      icon:
        body.icon || null,

      description:
        body.description || null,

      sortOrder:
        body.sortOrder
          ? Number(body.sortOrder)
          : 0,

      isFeatured:
        body.isFeatured === true ||
        body.isFeatured === "true",

      status:
        body.status
          ? body.status.toUpperCase()
          : "ACTIVE",

    });
  }

  async getAll() {
    return categoryRepository.findAll();
  }

  // async update(id: string, body: any) {
  //   return categoryRepository.update(id, body);
  // }

  async update(
  id: string,
  body: any,
  file?: Express.Multer.File
) {

  const category =
    await categoryRepository.findById(id);

  if (!category) {
    throw new AppError(
      "Category not found",
      404
    );
  }


  // Check duplicate name
  if (body.name) {

    const newName =
      body.name.trim();

    if (
      newName.toLowerCase() !==
      category.name.toLowerCase()
    ) {

      const exists =
        await categoryRepository.findByName(
          newName
        );

      if (exists) {
        throw new AppError(
          "Category already exists",
          400
        );
      }
    }
  }


  const updateData: any = {
    ...body,
  };


  if (body.name) {

    updateData.name =
      body.name.trim();

    updateData.slug =
      body.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
  }


  // New image uploaded
  if (file) {

    updateData.image =
      `/uploads/categories/${file.filename}`;
  }


  // Convert form-data strings
  if (body.sortOrder !== undefined) {

    updateData.sortOrder =
      Number(body.sortOrder);

  }


  if (body.isFeatured !== undefined) {

    updateData.isFeatured =
      body.isFeatured === true ||
      body.isFeatured === "true";

  }


  if (body.status !== undefined) {

    updateData.status =
      body.status.toUpperCase();

  }


  return categoryRepository.update(
    id,
    updateData
  );
}

  async delete(id: number) {
    await categoryRepository.delete(id);
  }
}

export default new CategoryService();
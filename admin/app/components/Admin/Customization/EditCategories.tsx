import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] = useEditLayoutMutation();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    console.log("Data from API:", data);
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
  }, [data]);

  useEffect(() => {
    if (layoutSuccess) {
      console.log("Layout update successful");
      refetch();
      toast.success("Categories updated successfully");
    }

    if (error) {
      console.error("Layout update error:", error);
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message || "Something went wrong");
      }
    }
  }, [layoutSuccess, error, refetch]);

  const handleCategoriesAdd = (index: number, value: string) => {
    setCategories((prevCategory) => {
      const newCategories = [...prevCategory];
      newCategories[index] = {
        ...newCategories[index],
        title: value
      };
      return newCategories;
    });
  };

  const newCategoriesHandler = () => {
    if (categories.length > 0 && categories[categories.length - 1].title === "") {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory) => [...prevCategory, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoryTitleEmpty = (categories: any[]) => {
    return categories.some((q) => q.title === "");
  };

  const editCategoriesHandler = async () => {
    console.log("Current categories:", categories);
    console.log("Original categories:", data?.layout?.categories);

    if (!data?.layout?.categories) {
      console.log("Creating new categories");
      // If no categories exist yet, create new ones
      await editLayout({
        type: "Categories",
        categories,
      });
      return;
    }

    if (
      !areCategoriesUnchanged(data.layout.categories, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      console.log("Updating existing categories");
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-[120px] text-center">
      <h1 className={`${styles.title}`}>All Categories</h1>
      {categories &&
        categories.map((item: any, index: number) => (
          <div className="p-3" key={item._id || index}>
            <div className="flex items-center w-full justify-center">
              <input
                className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                value={item.title}
                onChange={(e) => handleCategoriesAdd(index, e.target.value)}
                placeholder="Enter category title..."
              />
              <AiOutlineDelete
                className="dark:text-white text-black text-[18px] cursor-pointer ml-2"
                onClick={() => {
                  setCategories((prevCategory) =>
                    prevCategory.filter((_, i) => i !== index)
                  );
                }}
              />
            </div>
          </div>
        ))}
      <br />
      <br />
      <div className="w-full flex justify-center">
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newCategoriesHandler}
        />
      </div>
      <div
        className={`${
          styles.button
        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
        ${
          areCategoriesUnchanged(data?.layout?.categories || [], categories) ||
          isAnyCategoryTitleEmpty(categories)
            ? "!cursor-not-allowed"
            : "!cursor-pointer !bg-[#42d383]"
        }
        !rounded absolute bottom-12 right-12`}
        onClick={
          areCategoriesUnchanged(data?.layout?.categories || [], categories) ||
          isAnyCategoryTitleEmpty(categories)
            ? () => null
            : editCategoriesHandler
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditCategories;

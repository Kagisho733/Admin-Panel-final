import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import type { Category } from "../../types/Category";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import CategoriesTable from "../../components/categories/CategoriesTable";
import CategorySearch
    from "../../components/categories/CategorySearch";
import CategoryDetailsModal
    from "../../components/categories/CategoryDetailsModal";
import AddCategoryModal
    from "../../components/categories/AddCategoryModal";
import type { CategoryFormValue } from "../../components/categories/CategoryFormModal";
import EditCategoryModal
    from "../../components/categories/EditCategoryModal";
    import { toast } from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";


export default function CategoriesPage() {

    const { user } = useAuth();

    const [categories, setCategories] =
        useState<Category[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [sortField, setSortField] =
        useState<
            "name" |
            "productCount" |
            "status"
        >("name");

    const [sortDirection, setSortDirection] =
        useState<"asc" | "desc">("asc");

    const [currentPage, setCurrentPage] =
        useState(1);

    const categoriesPerPage = 10;

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const [addModalOpen, setAddModalOpen] =
        useState(false);

    const [editModalOpen, setEditModalOpen] =
        useState(false);



    async function loadCategories() {

        try {

            const data =
                await getCategories();

            setCategories(data);

        } catch (error) {

            console.error(
                "Error loading categories:",
                error
            );

        } finally {

            setLoading(false);

        }

    }

    function handleViewCategory(category: Category) {

        setSelectedCategory(category);

        setDetailsOpen(true);

    }


    function handleEditCategory(

        category: Category

    ) {

        setSelectedCategory(category);

        setEditModalOpen(true);

    }


    async function handleCreateCategory(

        category: CategoryFormValue

    ) {

        try {

            await createCategory(
                {
                    ...category,
                    productCount: 0,
                },
                user?.email ?? "Unknown"
            );

            await loadCategories();

            setAddModalOpen(false);

        } catch (error) {

            console.error(

                "Error creating category:",

                error

            );

        }

    }

    async function handleUpdateCategory(
        category: Category
    ) {

        if (!category.id) return;

        try {

            await updateCategory(
                category.id,
                {
                    name: category.name,
                    description: category.description,
                    storefrontDescription: category.storefrontDescription,
                    image: category.image,
                    displayOrder: category.displayOrder,
                    showOnHomepage: category.showOnHomepage,
                    status: category.status,
                    productCount: category.productCount,
                },
                user?.email ?? "Unknown"
            );

            await loadCategories();

            setEditModalOpen(false);

            setSelectedCategory(null);

        } catch (error) {

            console.error(
                "Error updating category:",
                error
            );

        }

    }


    async function handleDeleteCategory(
  category: Category
) {

  if (!category.id) return;

  const confirmed = window.confirm(

    `Delete "${category.name}"?\n\nThis action cannot be undone.`

  );

  if (!confirmed) return;

  try {

    await deleteCategory(
      category.id,
      user?.email ?? "Unknown",
      category.name
    );

    await loadCategories();

    toast.success("Category deleted successfully.");

  } catch (error) {

    console.error(
      "Error deleting category:",
      error
    );

    toast.error("Failed to delete category.");

  }

}

    useEffect(() => {

        loadCategories();

    }, []);

    useEffect(() => {

        setCurrentPage(1);

    }, [search]);

    useEffect(() => {

        setCurrentPage(1);

    }, [sortField, sortDirection]);

    if (loading) {

        return (

            <div className="text-center py-20">

                Loading Categories...

            </div>

        );

    }



    const filteredCategories =
        categories.filter((category) =>

            category.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

        );

    const sortedCategories =
        [...filteredCategories].sort(
            (a, b) => {

                const direction =
                    sortDirection === "asc"
                        ? 1
                        : -1;

                switch (sortField) {

                    case "name":

                        return (
                            a.name.localeCompare(
                                b.name
                            )
                        ) * direction;

                    case "status":

                        return (
                            a.status.localeCompare(
                                b.status
                            )
                        ) * direction;

                    case "productCount":

                        return (
                            a.productCount -
                            b.productCount
                        ) * direction;

                    default:

                        return 0;

                }

            }
        );

    const totalPages = Math.ceil(

        sortedCategories.length /

        categoriesPerPage

    );

    const indexOfLastCategory =

        currentPage *

        categoriesPerPage;

    const indexOfFirstCategory =

        indexOfLastCategory -

        categoriesPerPage;

    const paginatedCategories =

        sortedCategories.slice(

            indexOfFirstCategory,

            indexOfLastCategory

        );

    /*
|--------------------------------------------------------------------------
| Category Statistics
|--------------------------------------------------------------------------
*/

    const totalCategories =
        categories.length;

    const activeCategories =
        categories.filter(

            (category) =>

                category.status === "active"

        ).length;

    const inactiveCategories =
        categories.filter(

            (category) =>

                category.status === "inactive"

        ).length;

    const totalProducts =
        categories.reduce(

            (total, category) =>

                total + category.productCount,

            0

        );

    return (

        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Categories

                    </h1>

                    <p className="mt-2 text-gray-500">

                        Manage product categories.

                    </p>

                </div>

                <button

                    onClick={() => setAddModalOpen(true)}

                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"

                >

                    <FaPlus size={13} /> Add category

                </button>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <div className="rounded-xl bg-white border p-6">

                    <p className="text-gray-500">

                        Total Categories

                    </p>

                    <h2 className="mt-2 text-3xl font-bold">

                        {totalCategories}

                    </h2>

                </div>

                <div className="rounded-xl bg-white border p-6">

                    <p className="text-gray-500">

                        Active Categories

                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">

                        {activeCategories}

                    </h2>

                </div>

                <div className="rounded-xl bg-white border p-6">

                    <p className="text-gray-500">

                        Inactive Categories

                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-red-600">

                        {inactiveCategories}

                    </h2>

                </div>

                <div className="rounded-xl bg-white border p-6">

                    <p className="text-gray-500">

                        Products Assigned

                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">

                        {totalProducts}

                    </h2>

                </div>

            </div>
            <div className="flex">

                <CategorySearch

                    value={search}

                    onChange={setSearch}

                />

            </div>

         <CategoriesTable
  categories={paginatedCategories}
  onView={handleViewCategory}
  onEdit={handleEditCategory}
  onDelete={handleDeleteCategory}
  sortField={sortField}
  sortDirection={sortDirection}
  setSortField={setSortField}
  setSortDirection={setSortDirection}
/>

            <CategoryDetailsModal
                open={detailsOpen}
                category={selectedCategory}
                onClose={() => {

                    setDetailsOpen(false);

                    setSelectedCategory(null);

                }}
            />

            <AddCategoryModal

                open={addModalOpen}

                onClose={() =>

                    setAddModalOpen(false)

                }

                onSave={handleCreateCategory}

            />


            <EditCategoryModal

                open={editModalOpen}

                category={selectedCategory}

                onClose={() => {

                    setEditModalOpen(false);

                    setSelectedCategory(null);

                }}

              onSave={handleUpdateCategory}

            />

            <div className="flex items-center justify-between mt-6">

                <p className="text-gray-600">

                    Showing{" "}

                    {sortedCategories.length === 0

                        ? 0

                        : indexOfFirstCategory + 1}

                    –

                    {Math.min(

                        indexOfLastCategory,

                        sortedCategories.length

                    )}{" "}

                    of {sortedCategories.length} categories

                </p>

                <div className="flex gap-3">

                    <button
                        onClick={() =>

                            setCurrentPage((page) =>

                                Math.max(page - 1, 1)

                            )

                        }
                        disabled={currentPage === 1}
                        className="
        px-4
        py-2
        rounded-lg
        border
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
                    >

                        Previous

                    </button>

                    <span className="flex items-center px-3">

                        Page {currentPage} of {totalPages || 1}

                    </span>

                    <button
                        onClick={() =>

                            setCurrentPage((page) =>

                                Math.min(page + 1, totalPages)

                            )

                        }
                        disabled={
                            currentPage === totalPages ||

                            totalPages === 0
                        }
                        className="
        px-4
        py-2
        rounded-lg
        border
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
                    >

                        Next

                    </button>

                </div>

            </div>
        </div>

    );

}

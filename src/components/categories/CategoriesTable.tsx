import type { Category } from "../../types/Category";

interface Props {

    categories: Category[];
    onView: (category: Category) => void;

    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;

    sortField:
    | "name"
    | "productCount"
    | "status";

    sortDirection:
    "asc" | "desc";

    setSortField:
    React.Dispatch<
        React.SetStateAction<
            "name" |
            "productCount" |
            "status"
        >
    >;

    setSortDirection:
    React.Dispatch<
        React.SetStateAction<
            "asc" | "desc"
        >
    >;

}

export default function CategoriesTable({

    categories,

    onView,

    onEdit,

    onDelete,

    sortField,

    sortDirection,

    setSortField,

    setSortDirection,

}: Props) {


    function handleSort(

        field:
            | "name"
            | "productCount"
            | "status"

    ) {

        if (sortField === field) {

            setSortDirection((previous) =>

                previous === "asc"

                    ? "desc"

                    : "asc"

            );

        } else {

            setSortField(field);

            setSortDirection("asc");

        }

    }



    return (

        <div className="overflow-x-auto rounded-xl border bg-white">

            <table className="min-w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th
                            onClick={() => handleSort("name")}
                            className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
                        >

                            Name{" "}

                            {sortField === "name" &&

                                (sortDirection === "asc"

                                    ? "▲"

                                    : "▼")

                            }

                        </th>

                        <th className="px-6 py-4 text-left">

                            Description

                        </th>

                        <th
                            onClick={() => handleSort("productCount")}
                            className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
                        >

                            Products{" "}

                            {sortField === "productCount" && (

                                sortDirection === "asc"

                                    ? "▲"

                                    : "▼"

                            )}

                        </th>

                        <th
                            onClick={() => handleSort("status")}
                            className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
                        >

                            Status{" "}

                            {sortField === "status" && (

                                sortDirection === "asc"

                                    ? "▲"

                                    : "▼"

                            )}

                        </th>

                        <th className="px-6 py-4 text-left">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {categories.length === 0 ? (

                        <tr>

                            <td
                                colSpan={5}
                                className="py-10 text-center text-gray-500"
                            >

                                No categories found.

                            </td>

                        </tr>

                    ) : (

                        categories.map((category) => (

                            <tr
                                key={category.id}
                                className="border-t hover:bg-gray-50"
                            >

                                <td className="px-6 py-4">

                                    {category.name}

                                </td>

                                <td className="px-6 py-4">

                                    {category.description}

                                </td>

                                <td className="px-6 py-4">

                                    {category.productCount}

                                </td>

                                <td className="px-6 py-4">

                                    {category.status}

                                </td>

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => onEdit(category)}
                                            className="
        w-20
        rounded-lg
        bg-amber-500
        px-3
        py-2
        text-white
        hover:bg-amber-600
        transition-colors
      "
                                        >
                                            Edit
                                        </button>

         

                                        <button
                                            onClick={() => onView(category)}
                                            className="
        w-20
        rounded-lg
        bg-sky-600
        px-3
        py-2
        text-white
        hover:bg-sky-700
        transition-colors
      "
                                        >
                                            View
                                        </button>


                                                                       <button
                                            onClick={() => onDelete(category)}
                                            className="
        w-20
        rounded-lg
        bg-red-600
        px-3
        py-2
        text-white
        hover:bg-red-700
        transition-colors
      "
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}
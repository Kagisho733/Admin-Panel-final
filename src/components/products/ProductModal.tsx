/*
|--------------------------------------------------------------------------
| Product Modal
|--------------------------------------------------------------------------
| Reusable modal used for:
|
| • Add Product
| • Edit Product
|
| Children are injected into the modal body.
|--------------------------------------------------------------------------
*/

import { FaTimes } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ProductModal({
  isOpen,
  title,
  onClose,
  children,
}: Props) {

  // Don't render anything if closed
  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* Modal */}

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-6 overflow-hidden animate-fadeIn">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-8 py-5">

          <h2 className="text-2xl font-bold">

            {title}

          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >

            <FaTimes size={22} />

          </button>

        </div>

        {/* Body */}

        <div className="p-8 max-h-[75vh] overflow-y-auto">

          {children}

        </div>

      </div>

    </div>

  );

}
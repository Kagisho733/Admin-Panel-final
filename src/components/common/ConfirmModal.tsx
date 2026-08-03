interface Props {

  open: boolean;

  title: string;

  message: string;

  confirmText?: string;

  cancelText?: string;

  onConfirm: () => void;

  onCancel: () => void;

}

export default function ConfirmModal({

  open,

  title,

  message,

  confirmText = "Confirm",

  cancelText = "Cancel",

  onConfirm,

  onCancel,

}: Props) {

  if (!open) return null;

return (

  <div
    className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      p-6
      z-50
    "
  >

    {/* Modal Card */}

    <div
  className="
    bg-white
    rounded-2xl
    shadow-2xl
    w-full
    max-w-md
    overflow-hidden
  "
>

    <div className="p-6 border-b">

  <h2 className="text-2xl font-bold">

    {title}

  </h2>

</div>

<div className="p-6 space-y-4">

  <p className="text-gray-700">

    {message}

  </p>

  <p className="text-sm text-red-600 font-medium">

    This action cannot be undone.

  </p>

</div>

<div className="flex justify-end gap-4 p-6 border-t">

  <button
    onClick={onCancel}
    className="
      px-5
      py-2.5
      rounded-xl
      bg-gray-300
      hover:bg-gray-400
      transition
    "
  >
    {cancelText}
  </button>

  <button
    onClick={onConfirm}
    className="
      px-5
      py-2.5
      rounded-xl
      bg-red-600
      text-white
      hover:bg-red-700
      transition
    "
  >
    {confirmText}
  </button>

</div>

</div>

  </div>

);

}
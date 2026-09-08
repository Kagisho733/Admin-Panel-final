import { useState } from "react";
import { FaCheckCircle, FaCloudUploadAlt, FaImage, FaSpinner, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { uploadImage } from "../../services/imageService";

interface Props {
  images: string[];
  disabled: boolean;
  onChange: (images: string[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProductImageGallery({images, disabled, onChange}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const invalidType = files.find((file) => !file.type.startsWith("image/"));
    if (invalidType) {
      toast.error(`${invalidType.name} is not an image.`);
      return;
    }
    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      toast.error(`${oversized.name} is larger than 5 MB.`);
      return;
    }

    try {
      setUploading(true);
      const uploaded = await Promise.all(files.map((file) => uploadImage(file, "product-images")));
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded.`);
    } catch (reason) {
      console.error(reason);
      toast.error("One or more images could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onChange(next);
  }

  function remove(index: number) {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-800">Product images <span className="text-red-500">*</span></p>
        <span className="text-xs font-medium text-slate-500">{images.length} added</span>
      </div>

      {images.length > 0 ? (
        <div className="mb-4 grid grid-cols-2 gap-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className={`group relative overflow-hidden rounded-xl border-2 bg-slate-50 ${index === 0 ? "border-blue-500" : "border-slate-200"}`}>
              <img src={url} alt={`Product image ${index + 1}`} className="aspect-square w-full object-cover"/>
              {index === 0 && <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white"><FaCheckCircle/>Primary</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-slate-950/80 p-2 pt-8">
                {index !== 0 && <button type="button" disabled={disabled || uploading} onClick={() => makePrimary(index)} className="rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold text-slate-800">Make primary</button>}
                <button type="button" disabled={disabled || uploading} onClick={() => remove(index)} aria-label={`Remove product image ${index + 1}`} className="grid h-7 w-7 place-items-center rounded-lg bg-red-600 text-white"><FaTrash size={11}/></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4 grid aspect-video place-items-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400"><FaImage size={34}/></div>
      )}

      <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50 ${disabled || uploading ? "pointer-events-none opacity-50" : ""}`}>
        {uploading ? <FaSpinner className="animate-spin text-2xl text-blue-600"/> : <FaCloudUploadAlt className="text-3xl text-blue-600"/>}
        <span className="mt-2 text-sm font-bold text-slate-800">{uploading ? "Uploading images..." : images.length ? "Add more images" : "Choose product images"}</span>
        <span className="mt-1 text-xs text-slate-500">Select one or several PNG, JPG or WebP files • 5 MB each</span>
        <input type="file" multiple accept="image/png,image/jpeg,image/webp" disabled={disabled || uploading} onChange={handleUpload} className="sr-only"/>
      </label>
    </div>
  );
}

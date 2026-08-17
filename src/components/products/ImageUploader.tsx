import { useState } from "react";
import { FaCloudUploadAlt, FaImage, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { uploadImage } from "../../services/imageService";

interface Props { imageUrl: string; onImageUploaded: (url: string) => void; disabled: boolean; id?: string; label?: string; }
export default function ImageUploader({imageUrl, onImageUploaded, disabled, id = "image-upload", label = "Product image"}: Props) {
  const [uploading, setUploading] = useState(false);
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("The image must be smaller than 5 MB."); return; }
    try { setUploading(true); onImageUploaded(await uploadImage(file)); toast.success("Product image uploaded."); }
    catch (reason) { console.error(reason); toast.error("Image upload failed. Please try again."); }
    finally { setUploading(false); event.target.value = ""; }
  }
  return <div><label className="mb-2 block text-sm font-bold text-slate-800">{label} <span className="text-red-500">*</span></label><div className="grid gap-4 sm:grid-cols-[10rem_1fr]">{imageUrl ? <img src={imageUrl} alt="Product preview" className="h-40 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"/> : <div className="grid h-40 place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400"><FaImage size={34}/></div>}<label htmlFor={id} className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50 ${disabled ? "pointer-events-none opacity-50" : ""}`}>{uploading ? <FaSpinner className="animate-spin text-2xl text-blue-600"/> : <FaCloudUploadAlt className="text-3xl text-blue-600"/>}<span className="mt-2 font-bold text-slate-800">{uploading ? "Uploading..." : imageUrl ? "Replace image" : "Choose an image"}</span><span className="mt-1 text-xs text-slate-500">PNG, JPG or WebP • maximum 5 MB</span><input id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled || uploading} onChange={handleUpload} className="sr-only"/></label></div></div>;
}

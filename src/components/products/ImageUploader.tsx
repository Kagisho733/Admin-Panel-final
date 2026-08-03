/*
|--------------------------------------------------------------------------
| Image Uploader
|--------------------------------------------------------------------------
| Uploads product images to Supabase Storage.
|--------------------------------------------------------------------------
*/

import { useState } from "react";

import { uploadImage } from "../../services/imageService";

interface Props {
  imageUrl: string;

  onImageUploaded: (url: string) => void;
  disabled: boolean;

  id?: string;
  label?: string;
}

export default function ImageUploader({
  imageUrl,
  onImageUploaded,
  disabled,
  id = "image-upload",
  label = "Image",
}: Props) {

  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    if (!e.target.files?.length) return;

    const file = e.target.files[0];

    setUploading(true);

    try {

      const url = await uploadImage(file);

      onImageUploaded(url);

    } catch (error) {

      console.error(error);

      alert("Image upload failed.");

    } finally {

      setUploading(false);

    }

  }

  return (

    <div className="space-y-4">

      <label
        htmlFor={id}
        className="block font-medium"
      >
       {label}
      </label>

      <input
        disabled={disabled}
       id={id}
        name="product-image"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="w-full"
      />

      {uploading && (

        <p className="text-blue-600">

          Uploading image...

        </p>

      )}

      {imageUrl && (

        <img
          src={imageUrl}
          alt="Product"
          className="w-48 h-48 object-cover rounded-xl border"
        />

      )}

    </div>

  );

}
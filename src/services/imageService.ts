import { apiRequest } from "./api/client";

const readAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.onerror = () => reject(reader.error || new Error("File could not be read"));
  reader.readAsDataURL(file);
});

export async function uploadImage(file: File, folder = "product-images") {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are supported");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be smaller than 5 MB");
  const response = await apiRequest<{image: {downloadUrl: string}}>("/storage/upload", {
    method: "POST",
    body: JSON.stringify({
      folder,
      fileName: file.name,
      contentType: file.type,
      base64: await readAsDataUrl(file),
    }),
  });
  return response.image.downloadUrl;
}

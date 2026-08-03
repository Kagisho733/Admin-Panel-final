// /*
// |--------------------------------------------------------------------------
// | Image Service
// |--------------------------------------------------------------------------
// | Handles uploading product images to Supabase Storage.
// |--------------------------------------------------------------------------
// */

// import { supabase } from "../supabase/supabase";

// /*
// |--------------------------------------------------------------------------
// | Upload Product Image
// |--------------------------------------------------------------------------
// */

// export async function uploadImage(file: File) {

//   // Create unique filename

//   const fileName = `${Date.now()}-${file.name}`;

//   // Upload image

//   const { error } = await supabase.storage

//     .from("products")

//     .upload(fileName, file);

//   if (error) {

//     throw error;

//   }

//   // Get public URL

//   const {

//     data,

//   } = supabase.storage

//     .from("products")

//     .getPublicUrl(fileName);

//   return data.publicUrl;

// }

// import { supabase } from "../supabase/supabase";

// export async function uploadImage(file: File) {

//   const fileName = `${Date.now()}-${file.name}`;

//   console.log("Uploading:", fileName);

//   const { data, error } = await supabase.storage
//     .from("products")
//     .upload(fileName, file);

//   console.log("Upload Data:", data);
//   console.log("Upload Error:", error);

//   if (error) {
//     throw error;
//   }

//   const { data: publicData } = supabase.storage
//     .from("products")
//     .getPublicUrl(fileName);

//   console.log("Public URL:", publicData.publicUrl);

//   return publicData.publicUrl;
// }

import { supabase } from "../supabase/supabase";

export async function uploadImage(file: File) {

  console.log("Buckets...");

  const buckets = await supabase.storage.listBuckets();

  console.log(buckets);

  const fileName = `${Date.now()}-${file.name}`;

  const result = await supabase.storage
    .from("products")
    .upload(fileName, file);

  console.log(result);

  if (result.error) throw result.error;

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
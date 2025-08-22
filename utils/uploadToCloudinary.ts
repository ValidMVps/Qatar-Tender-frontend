// utils/uploadToCloudinary.js
export const uploadToCloudinary = async (file) => {
  try {
    console.log("🔄 Starting Cloudinary upload...");
    console.log("📁 File details:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Get environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("☁️ Cloudinary config:", {
      cloudName,
      uploadPreset: uploadPreset ? "✅ Set" : "❌ Missing"
    });

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', cloudName);

    // Optional: Add folder organization
    formData.append('folder', 'tender-images');

    // Log FormData contents (for debugging)
    console.log("📦 FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log("🌐 Upload URL:", uploadUrl);

    // Make the upload request
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log("📡 Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Cloudinary error response:", errorText);
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Cloudinary success response:", {
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes
    });

    // Verify we got a valid URL
    if (!data.secure_url) {
      console.error("❌ No secure_url in response:", data);
      throw new Error("Invalid response from Cloudinary - no secure_url");
    }

    console.log("🎉 Upload successful! URL:", data.secure_url);
    return data.secure_url;

  } catch (error) {
    console.error("💥 Cloudinary upload error:", error);
    console.error("Error stack:", error.stack);

    // Throw a more descriptive error
    if (error.message.includes('fetch')) {
      throw new Error("Network error: Unable to connect to Cloudinary. Check your internet connection.");
    } else if (error.message.includes('configuration')) {
      throw new Error("Cloudinary configuration error: " + error.message);
    } else {
      throw new Error("Image upload failed: " + error.message);
    }
  }
};

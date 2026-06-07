export const uploadToCloudinary = async (file) => {
    const cloudName = "dlqxgrmzg";
    const uploadPreset = "mba-kapde";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
};
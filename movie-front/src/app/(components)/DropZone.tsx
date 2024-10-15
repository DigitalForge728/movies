import React, { ChangeEvent, useEffect, useState } from "react";

interface ImageUploadProps {
  onDrop: (acceptedFiles: { base64: string; file: File }[]) => void;
  initialImage?: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onDrop, initialImage }) => {
  const [image, setImage] = useState<string | null>(initialImage || null);

  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      setImage(base64);
      onDrop([{ base64, file }]);
    };
    reader.onerror = (error) => {
      console.error("Error converting file to Base64:", error);
    };
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center w-full mb-5 h-[500px] border-2 border-dashed border-[#cccccc] rounded-lg bg-[#224957] relative overflow-hidden">
      {image ? (
        <div className="relative w-full h-full">
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-transparent border-none cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_3_346)">
              <path
                d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_3_346">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="m-0 text-white">Click to upload an image</p>
        </>
      )}
    </div>
  );
};

export default ImageUpload;

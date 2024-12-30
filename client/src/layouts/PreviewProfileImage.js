import React, { useState } from "react";

const PreviewProfileImage = ({ file }) => {
  const [preview, setPreview] = useState(null);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    setPreview(reader.result);
  };
  return (
    <div>
      <div className="w-24 h-24 rounded-full">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full rounded-full"
          />
        ) : (
          "Loading ..."
        )}
      </div>
    </div>
  );
};

export default PreviewProfileImage;

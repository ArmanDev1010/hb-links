import React from "react";
import Image from "next/image";

export default function ImageCols({ images_array }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-[5%] max-700:grid-cols-1">
      {images_array?.map((image, key) => (
        <Image
          src={image}
          key={key}
          alt=""
          width={800}
          height={800}
          className="bg-gray-500 aspect-[16/16] w-full h-full object-cover"
        />
      ))}
    </div>
  );
}

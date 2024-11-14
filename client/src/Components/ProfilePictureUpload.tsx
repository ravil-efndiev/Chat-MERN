import React, { useRef, useState } from "react";
import { Button, Avatar, Typography, Box } from "@mui/material";

interface Props {
  onFileChange: (file: File) => void;
  width?: string | number;
  defaultPfpURL?: string;
  customHeading?: string;
  customSx?: {[key: string]: any};
}

function ProfilePictureUpload({
  onFileChange,
  width,
  defaultPfpURL,
  customHeading,
  customSx,
}: Props) {
  const [preivew, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onFileChange(files[0]);
      };
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        ...customSx,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: width || "auto",
        p: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {customHeading || "Upload Profile Picture"}
      </Typography>
      <Avatar
        alt="Profile Picture"
        src={preivew || defaultPfpURL || ""}
        sx={{ width: 100, height: 100, marginBottom: 2, mx: "auto" }}
      />
      <Box sx={{ display: "flex" }}>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
          ref={fileInputRef}
        />
        <Button variant="outlined" color="primary" onClick={handleUploadClick}>
          Choose File
        </Button>
      </Box>
    </Box>
  );
}

export default ProfilePictureUpload;

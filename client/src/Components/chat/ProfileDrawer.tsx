import { Drawer } from '@mui/material'
import React, { useState } from "react"
import { useAuth } from '../authentication/AuthProvider';

interface Props {
  open: boolean;
  onClose: () => void;
}

function ProfileDrawer({ open, onClose }: Props) {
  const { currentUser } = useAuth();
  const [newPfp, setNewPfp] = useState<File | null>();
  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const handleProfileUpdate = (event: React.FormEvent) => {
    event.preventDefault();

    const data = new FormData();
    //TODO: submit changes to /api/users/update
  }

  return (
    <Drawer
      open={open}
      onClose={() => onClose()}
    >
      <ProfilePictureUpload
        width="45%"
        onFileChange={(file) => setNewPfp(file)}
      />
    </Drawer>
  )
}

export default ProfileDrawer;

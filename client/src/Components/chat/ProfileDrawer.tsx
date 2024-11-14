import { Drawer } from '@mui/material'

interface Props {
  open: boolean;
  onClose: () => void;
}

function ProfileDrawer({ open, onClose }: Props) {
  return (
    <Drawer
      open={open}
      onClose={() => onClose()}
    >

    </Drawer>
  )
}

export default ProfileDrawer;

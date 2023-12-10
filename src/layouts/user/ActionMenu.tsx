import React, {  useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import CreateClassModal from "../../components/CreateClassModal";

const ActionMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [t] = useTranslation("global");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
    handleClose();
  }

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  }

  return (
    <div>
      <IconButton
        onClick={handleClick}
        sx={{
          width: "40px",
          height: "40px", // Set button size
        }}
        color="inherit"
      >
        <Add />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
          }}
        >
          {t("joinClass")}
        </MenuItem>

        <MenuItem
          onClick={handleOpenCreateDialog}
        >
          {t("createClass")}
        </MenuItem>
      </Menu>
      
      <CreateClassModal isOpen={isCreateDialogOpen} onClose={handleCloseCreateDialog} />

    </div>
  );
};

export default ActionMenu;

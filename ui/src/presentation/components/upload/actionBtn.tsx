import { useState } from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Button } from '@mui/material';
import UploadedWindow from './upload_container/uploadWindow.tsx';
import './actionBtn.css';

const ActionButton = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleBack = () => {
    setIsClicked(false);
  };

  return (
      <div>
        {isClicked ? (
            <UploadedWindow onBack={handleBack} />
        ) : (
            <Button
                variant="contained"
                endIcon={<RocketLaunchIcon />}
                className="shake-on-hover"
                onClick={handleClick}
            >
              Launch
            </Button>
        )}
      </div>
  );
};

export default ActionButton;

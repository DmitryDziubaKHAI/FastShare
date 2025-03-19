import { useState } from "react";
import { Button } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UploadedWindow from "../launch/uploadWindow";

const ActionButton = () => {
    const [isClicked, setIsClicked] = useState(false);

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

import { Box, Button, TextField, IconButton, List, ListItem, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import './file_container.css';
import './addBtn.css';
import IUploadedWindowProps from "@/application/interfaces/IUploadedWindowProps.ts";
import * as React from "react";
import { useRef, useState } from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { handleFileChange, handleAddClick, handleUploadClick, handleDeleteFile, truncateFileName } from './uploadHelper.ts';
import DownloadModal from './DownloadModal';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const UploadedWindow: React.FC<IUploadedWindowProps> = ({ onBack }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState<string>('');
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClearAllFiles = async () => {
        try {
            const response = await fetch('/clear-files', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                alert('Please login first');
                return;
            }
            
            if (response.ok) {
                setFiles([]);
                if (isDownloadModalOpen) {
                    setIsDownloadModalOpen(false);
                    setTimeout(() => setIsDownloadModalOpen(true), 100);
                }
            } else {
                const data = await response.json();
                console.error('Failed to clear files:', data.message);
            }
        } catch (error) {
            console.error('Error clearing files:', error);
        }
    };

    return (
        <Box className="file-container">
            <Grid container spacing={1} sx={{ padding: 2, width: '100%', height: '100%', justifyContent: "center" }}>
                <Grid item container spacing={1} xs={5}>
                    <Grid item xs={12}>
                        <IconButton
                            className="wave-button"
                            onClick={() => handleAddClick(fileInputRef)}
                        >
                            <AddIcon />
                        </IconButton>
                        
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, setFiles)}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Protect files with password"
                            type="password"
                            variant="filled"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                inputProps: { style: { textAlign: "center" } }
                            }}
                        />
                    </Grid>

                    <Grid item container spacing={1} xs={12}>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => handleUploadClick(files, password, setFiles)}
                                fullWidth
                            >
                                Upload files
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                startIcon={<GetAppIcon />}
                                onClick={() => setIsDownloadModalOpen(true)}
                                fullWidth
                            >
                                Download files
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteSweepIcon />}
                                onClick={handleClearAllFiles}
                                fullWidth
                            >
                                Clear all files
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item container xs={7} sx={{ height: '100%' }}>
                    <Grid item xs={12} sx={{ flexGrow: 1, overflow: 'auto' }}>
                        <List>
                            {files.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        borderRadius: 1,
                                        boxShadow: 1,
                                        marginBottom: 1,
                                        '&:hover': {
                                            boxShadow: 3,
                                            borderColor: 'primary.main',
                                        },
                                        transition: 'box-shadow 0.3s, border-color 0.3s',
                                    }}
                                >
                                    <ListItem
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeleteFile(index, files, setFiles)}
                                                sx={{
                                                    '&:hover': {
                                                        color: 'error.main',
                                                    },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <InsertDriveFileIcon sx={{ marginRight: 2 }} />
                                        <ListItemText
                                            primary={truncateFileName(file.name, 30)}
                                            secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '200px',
                                            }}
                                        />
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                        <IconButton
                            onClick={onBack}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#e0e0e0'
                                }
                            }}
                        >
                            <UndoIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>

            <DownloadModal 
                open={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
            />
        </Box>
    );
};

export default UploadedWindow;




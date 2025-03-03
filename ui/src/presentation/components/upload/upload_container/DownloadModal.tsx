// Should fix on each side like back nd front, Not working yet...
//
//
//
//
//
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Box,
    CircularProgress
} from '@mui/material';
import { handleDownloadClick } from './uploadHelper';
import GetAppIcon from '@mui/icons-material/GetApp';
import {FileInfo} from "@/application/interfaces/IUploadedWindowProps.ts";

interface DownloadModalProps {
    open: boolean;
    onClose: () => void;
}

const DownloadModal = ({ open, onClose }: DownloadModalProps) => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [passwords, setPasswords] = useState<{[key: string]: string}>({});
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch('/files', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setFiles(data.files || []);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchFiles();
        }
    }, [open]);

    const handlePasswordChange = (fileId: string, password: string) => {
        setPasswords(prev => ({
            ...prev,
            [fileId]: password
        }));
    };

    const handleDownload = async (fileId: string, hasPassword: boolean) => {
        const password = hasPassword ? passwords[fileId] : undefined;
        if (hasPassword && !password) {
            alert('Please enter password');
            return;
        }
        
        try {
            await handleDownloadClick(fileId, password);
            if (hasPassword) {
                setPasswords(prev => ({
                    ...prev,
                    [fileId]: ''
                }));
            }
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Download Files</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {files.map((file) => (
                            <ListItem
                                key={file.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Box flex={1}>
                                    <ListItemText 
                                        primary={file.filename}
                                        secondary={`${(file.size / 1024).toFixed(2)} KB • ${new Date(file.createdAt).toLocaleString()}`}
                                    />
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    {file.hasPassword && (
                                        <TextField
                                            type="password"
                                            placeholder="Enter password"
                                            size="small"
                                            value={passwords[file.id] || ''}
                                            onChange={(e) => handlePasswordChange(file.id, e.target.value)}
                                        />
                                    )}
                                    <IconButton 
                                        onClick={() => handleDownload(file.id, file.hasPassword)}
                                        color="primary"
                                    >
                                        <GetAppIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DownloadModal; 
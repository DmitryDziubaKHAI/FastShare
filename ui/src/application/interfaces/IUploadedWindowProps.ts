export default interface IUploadedWindowProps {
    onBack: () => void;
}



export interface FileInfo {
    id: string;
    filename: string;
    size: number;
    hasPassword: boolean;
    createdAt: string;
}
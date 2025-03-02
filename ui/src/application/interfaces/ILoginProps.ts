export default interface ILoginProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onLoginSuccess: (userData?: { id: string; email: string }) => void;
}
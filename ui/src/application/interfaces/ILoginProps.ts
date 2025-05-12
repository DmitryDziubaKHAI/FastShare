import { UserData } from '@/application/interfaces/IUserData';

export default interface ILoginProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLoginSuccess: (userData: UserData) => void;  
}
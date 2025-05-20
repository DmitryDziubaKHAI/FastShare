import ActionButton from '../launch/actionBtn';
import { useAuth } from '@/application/context/AuthContext';

const firstTitle = 'Transfer and have your files travel for free';
const lowerTitle = 'FastShare is a simple and free way to securely share your files and folders.';

const Home = () => {
    const {isAuthenticated} = useAuth();
    return (
        <div className="upload-button-container">
            <div className="upload-button-text">
                <h1>{firstTitle}</h1>
                <h2>{lowerTitle}</h2>
            </div>

            {isAuthenticated && <ActionButton/>}
        </div>
    );
}

export default Home;
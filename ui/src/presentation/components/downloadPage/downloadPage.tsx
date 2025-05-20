import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DownloadPage = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [data, setData] = useState<null | { filename: string }>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`http://localhost:3000/downloadPage?id=${id}`)
                .then(async (res) => {
                    if (res.status === 201) {
                        const json = await res.json();
                        setData(json);
                    } else {
                        const err = await res.json();
                        setError(err.message || 'Unknown error');
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Помилка з’єднання з сервером');
                    setLoading(false);
                });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        const res = await fetch('http://localhost:3000/downloadPage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                password,
                validate: true,
            }),
        });

        if (res.status === 201) {
            // Пароль правильный — скачиваем файл
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'http://localhost:3000/downloadPage';
            form.target = '_blank';

            form.style.display = 'none';

            const fields = {
                id,
                password,
                validate: 'false',
            };

            for (const [key, value] of Object.entries(fields)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        } else if (res.status === 403) {
            const err = await res.json();
            setPasswordError(err.message || 'Wrong password');
        } else {
            setPasswordError('Unexpected error');
        }
    };

    return (
        <div className="upload-button-container">
            <div className="upload-button-text">
                {loading && <h2>Пошук файлу...</h2>}

                {!loading && data && (
                    <>
                        <h1>
                            Знайденний файл: <b>{data.filename}</b>
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <label>Пароль до файлу</label>
                            <br />
                            <br />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br />
                            <br />
                            <input type="submit" value="Завантажити" />
                            {passwordError && (
                                <p style={{ color: 'red' }}>{passwordError}</p>
                            )}
                        </form>
                    </>
                )}

                {!loading && error && (
                    <h2 style={{ color: 'red' }}>Помилка: {error}</h2>
                )}
            </div>
        </div>
    );
};

export default DownloadPage;

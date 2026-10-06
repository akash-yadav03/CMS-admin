function Login() {
    const navigate = ReactRouterDOM.useNavigate();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    function handleLogin(event) {
        event.preventDefault();

        setError("");
        // Temporary login
        if (
            username === "admin" &&
            password === "password"
        ) {
            localStorage.setItem("loggedIn", "true");
            navigate("/dashboard");
        } else {
            setError("Invalid username or password");
        }
    }

    return (
        <div className="login-page">
            <div className="login-box">
                <h1>CMS</h1>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>

                        <input type="text" value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }/>
                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input type="password" value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }/>
                    </div>

                    {error && (
                        <p className="error">
                            {error}
                        </p>
                    )}

                    <button type="submit"> Login </button>

                </form>
            </div>
        </div>
    );
}
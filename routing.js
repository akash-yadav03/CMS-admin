const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

// Protected route
function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
}
    return children;
}

// Application routes
function AppRoutes() {
    return (
    <HashRouter>
        <Routes>

            {/* Login */}
            <Route
                path="/login"
                element={<Login />}
            />

            {/* Dashboard - Protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <App />
                    </ProtectedRoute>
                }
            />

            {/* Default route */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Unknown routes */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    </HashRouter>
);
}
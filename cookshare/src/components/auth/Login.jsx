import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import { getCurrentUser } from "../services/UserService";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [debugInfo, setDebugInfo] = useState(null); // Thêm state để hiển thị thông tin gỡ lỗi

    // Hàm để lưu username vào localStorage với nhiều kiểm tra hơn
    const saveUsernameToLocalStorage = (userData) => {
        try {
            console.log("Attempting to save user data to localStorage:", userData);
            
            // Kiểm tra xem userData có tồn tại không
            if (!userData) {
                console.error("userData is null or undefined");
                setDebugInfo("userData is null or undefined");
                return false;
            }
            
            // Thử lấy username từ nhiều trường khác nhau
            let username = null;
            
            if (userData.userName) username = userData.userName;
            else if (userData.userName) username = userData.userName;
            else if (userData.name) username = userData.name;
            else if (userData.email) username = userData.email;
            else if (userData.sub) username = userData.sub; // JWT subject
            else if (userData.id) username = `user${userData.id}`;
            else if (typeof userData === 'string') username = userData;
            
            // Nếu không tìm thấy username trong bất kỳ trường nào
            if (!username) {
                // Hiển thị toàn bộ đối tượng userData để gỡ lỗi
                console.error("Could not find username in userData:", userData);
                setDebugInfo(`Could not find username in userData: ${JSON.stringify(userData)}`);
                
                // Sử dụng giá trị mặc định
                username = "User";
            }
            
            console.log("Saving username to localStorage:", username);
            
            // Lưu vào localStorage
            localStorage.setItem("username", username);
            
            // Kiểm tra xem đã lưu thành công chưa
            const savedUsername = localStorage.getItem("username");
            console.log("Verification - Retrieved from localStorage:", savedUsername);
            
            if (savedUsername === username) {
                console.log("Successfully saved username to localStorage");
                return true;
            } else {
                console.error("Failed to save username to localStorage");
                setDebugInfo("Failed to save username to localStorage");
                return false;
            }
        } catch (error) {
            console.error("Error saving username to localStorage:", error);
            setDebugInfo(`Error saving username to localStorage: ${error.message}`);
            return false;
        }
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                console.log("Checking auth status...");
                const currentUrl = window.location.href;
                const urlParams = new URLSearchParams(window.location.search);
                const loginSuccess = urlParams.get('login_success');
                const code = urlParams.get('code');
                const token = urlParams.get('token');
                const isRedirectAfterLogin = 
                    loginSuccess === 'true' || 
                    code || 
                    token  ;
                if (isRedirectAfterLogin) {
                    console.log("Detected redirect after login. Fetching user data...");
                    try {
                        const user = await getCurrentUser();
                        if (user) {
                            localStorage.setItem("userId", user.id);
                            localStorage.setItem("username", user.userName || user.name || user.email || "User");
                            localStorage.setItem("email", user.email || "");
                            setSuccessMessage("Đăng nhập thành công! Chào mừng đến với CookDocs.");
                            setTimeout(() => {
                                window.location.href = "/home";
                            }, 1000);
                        } else {
                            setErrorMessage("Đăng nhập thành công nhưng không thể lấy thông tin người dùng.");
                        }
                    } catch (error) {
                        setErrorMessage("Không thể lấy thông tin người dùng. Đã sử dụng tên người dùng mặc định.");
                        localStorage.setItem("username", "User");
                        setTimeout(() => {
                            window.location.href = "/home";
                        }, 2000);
                    }
                } else {
                    console.log("Not a redirect after login");
                }
            } catch (error) {
                console.error("Error during auth check:", error);
                setErrorMessage("Lỗi trong quá trình kiểm tra xác thực: " + error.message);
                setDebugInfo(`Error during auth check: ${error.message}`);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuthStatus();
    }, []);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        try {
            window.location.href = "http://localhost:8080/oauth2/authorization/google";
        } catch (error) {
            setErrorMessage("Đã xảy ra lỗi khi chuyển hướng đến Google OAuth2.");
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = () => {
        setIsLoading(true);
        try {
            window.location.href = "http://localhost:8080/oauth2/authorization/facebook";
        } catch (error) {
            setErrorMessage("Đã xảy ra lỗi khi chuyển hướng đến Facebook OAuth2.");
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f6f7f8",
            }}
        >
            <Container className="py-5" style={{ maxWidth: "420px" }}>
                <Card
                    style={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 4px 24px 0 rgba(60, 60, 60, 0.18)",
                        background: "#fff",
                    }}
                >
                    <Card.Body className="px-4 py-4">
                        <div className="text-center mb-2">
                            <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 8 }}>Đăng nhập</h2>
                            <div style={{ fontSize: "1rem", color: "#7c7c7c" }}>
                                Bằng việc tiếp tục, bạn đồng ý với
                                <a href="#" style={{ color: "#0079d3", textDecoration: "none", margin: "0 4px" }}>Điều khoản</a>
                                và
                                <a href="#" style={{ color: "#0079d3", textDecoration: "none", margin: "0 4px" }}>Chính sách</a>
                                của chúng tôi.
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-3 mt-4 mb-3">
                            <Button
                                onClick={handleGoogleLogin}
                                style={{
                                    backgroundColor: "#fff",
                                    borderColor: "#e6e6e6",
                                    color: "#1a1a1b",
                                    borderRadius: "999px",
                                    padding: "10px 15px",
                                    fontWeight: 600,
                                    width: "100%",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    boxShadow: "0 1px 2px rgba(60,60,60,0.08)",
                                }}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                                    alt="Google Logo"
                                    style={{ width: "22px", height: "22px", borderRadius: "50%" }}
                                />
                                <span style={{ flex: 1, textAlign: "center", fontWeight: 500 }}>Đăng nhập với Google</span>
                            </Button>
                            <Button
                                onClick={handleFacebookLogin}
                                style={{
                                    backgroundColor: "#fff",
                                    borderColor: "#e6e6e6",
                                    color: "#1a1a1b",
                                    borderRadius: "999px",
                                    padding: "10px 15px",
                                    fontWeight: 600,
                                    width: "100%",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    boxShadow: "0 1px 2px rgba(60,60,60,0.08)",
                                }}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                    alt="Facebook Logo"
                                    style={{ width: "22px", height: "22px", borderRadius: "50%" }}
                                />
                                <span style={{ flex: 1, textAlign: "center", fontWeight: 500 }}>Đăng nhập với Facebook</span>
                            </Button>
                        </div>
                        <div className="d-flex align-items-center my-3">
                            <div style={{ flex: 1, height: 1, background: "#edeff1" }} />
                            <span style={{ margin: "0 12px", color: "#878a8c", fontWeight: 600 }}>OR</span>
                            <div style={{ flex: 1, height: 1, background: "#edeff1" }} />
                        </div>
                        <Form>
                            <Form.Group className="mb-2" controlId="formBasicEmail">
                                <Form.Label style={{ fontSize: "0.95rem", color: "#878a8c", marginBottom: 2 }}>Email or username</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email or username"
                                    style={{
                                        borderRadius: "12px",
                                        border: "1px solid #edeff1",
                                        padding: "14px 16px",
                                        fontSize: "1rem",
                                        background: "#f6f7f8",
                                        color: "#1a1a1b",
                                    }}
                                />
                                <div style={{ color: "#ff585b", fontSize: 18, marginTop: -2 }}>*</div>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicPassword">
                                <Form.Label style={{ fontSize: "0.95rem", color: "#878a8c", marginBottom: 2 }}>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    style={{
                                        borderRadius: "12px",
                                        border: "1px solid #edeff1",
                                        padding: "14px 16px",
                                        fontSize: "1rem",
                                        background: "#f6f7f8",
                                        color: "#1a1a1b",
                                    }}
                                />
                                <div style={{ color: "#ff585b", fontSize: 18, marginTop: -2 }}>*</div>
                            </Form.Group>
                            <div className="mb-3">
                                <a href="#" style={{ color: "#0079d3", fontSize: "0.98rem", textDecoration: "none" }}>Forgot password?</a>
                            </div>
                            <Button
                                type="submit"
                                style={{
                                    width: "100%",
                                    borderRadius: "999px",
                                    background: "#edeff1",
                                    color: "#a8aaab",
                                    border: "none",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                    height: "48px",
                                    marginBottom: 8,
                                    cursor: "not-allowed",
                                }}
                                disabled
                            >
                                Log In
                            </Button>
                        </Form>
                        <div className="text-center mt-3" style={{ fontSize: "1rem" }}>
                            New to CookDocs? <a href="#" style={{ color: "#0079d3", fontWeight: 600, textDecoration: "none" }}>Sign Up</a>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;

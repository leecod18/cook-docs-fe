import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

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
                
                // Kiểm tra URL hiện tại
                const currentUrl = window.location.href;
                console.log("Current URL:", currentUrl);
                
                // Kiểm tra các tham số URL
                const urlParams = new URLSearchParams(window.location.search);
                const loginSuccess = urlParams.get('login_success');
                const code = urlParams.get('code');
                const token = urlParams.get('token');
                
                console.log("URL params - login_success:", loginSuccess);
                console.log("URL params - code:", code);
                console.log("URL params - token:", token);
                
                // Kiểm tra xem có phải là redirect sau khi đăng nhập không
                const isRedirectAfterLogin = 
                    loginSuccess === 'true' || 
                    code || 
                    token  ;
                
                if (isRedirectAfterLogin) {
                    console.log("Detected redirect after login. Fetching user data...");
                    
                    // Thử gọi API để lấy thông tin người dùng
                    const response = await fetch("http://localhost:8080/api/users/register", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Accept": "application/json"
                        }
                    });
                    
                    console.log("API response status:", response.status);
                    
                    if (response.ok) {
                        let userData;
                        const contentType = response.headers.get("content-type");
                        
                        if (contentType && contentType.includes("application/json")) {
                            userData = await response.json();
                            console.log("User data from API (JSON):", userData);
                        } else {
                            const textData = await response.text();
                            console.log("User data from API (Text):", textData);
                            
                            // Thử chuyển đổi text thành JSON
                            try {
                                userData = JSON.parse(textData);
                                console.log("Parsed text data to JSON:", userData);
                            } catch (e) {
                                console.log("Could not parse as JSON, using as text");
                                userData = textData;
                            }
                        }
                        
                        // Lưu username vào localStorage
                        const saveSuccess = saveUsernameToLocalStorage(userData);
                        
                        if (saveSuccess) {
                            setSuccessMessage("Đăng nhập thành công! Chào mừng đến với CookDocs.");
                            
                            // Chuyển hướng đến trang /home sau 1 giây
                            setTimeout(() => {
                                window.location.href = "/home";
                            }, 1000);
                        } else {
                            setErrorMessage("Đăng nhập thành công nhưng không thể lưu thông tin người dùng.");
                        }
                    } else {
                        console.error("Failed to get user data from API");
                        
                        // Thử phương án dự phòng - lưu một username mặc định
                        console.log("Trying fallback - saving default username");
                        localStorage.setItem("username", "User");
                        
                        setErrorMessage("Không thể lấy thông tin người dùng. Đã sử dụng tên người dùng mặc định.");
                        
                        // Chuyển hướng đến trang /home sau 2 giây
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
                backgroundImage: "linear-gradient(to right, #f5f7fa, #f8e8ff)",
            }}
        >
            <Container className="py-5" style={{ maxWidth: "500px" }}>
                <Card
                    style={{
                        borderRadius: "15px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(138, 43, 226, 0.1)",
                    }}
                >
                    <Card.Header
                        style={{
                            backgroundColor: "#8a2be2",
                            color: "white",
                            borderRadius: "15px 15px 0 0",
                            padding: "20px",
                        }}
                        className="text-center"
                    >
                        <h3 className="mb-0">🍳 Đăng Nhập Vào CookDocs 🥘</h3>
                    </Card.Header>
                    <Card.Body className="px-4 py-4">
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        {debugInfo && (
                            <Alert variant="info" className="mt-2">
                                <details>
                                    <summary>Debug Info</summary>
                                    <pre>{debugInfo}</pre>
                                </details>
                            </Alert>
                        )}
                        <div className="d-flex flex-column gap-3">
                            <Button
                                onClick={handleGoogleLogin}
                                style={{
                                    backgroundColor: "#8a2be2",
                                    borderColor: "#8a2be2",
                                    color: "white",
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                    fontWeight: "600",
                                    width: "100%",
                                    height: "50px",
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                                    alt="Google Logo"
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                    }}
                                />
                                <span style={{ textAlign: "center", width: "100%" }}>Đăng nhập bằng Google</span>
                            </Button>
                            <Button
                                onClick={handleFacebookLogin}
                                style={{
                                    backgroundColor: "#3b5998",
                                    borderColor: "#3b5998",
                                    color: "white",
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                    fontWeight: "600",
                                    width: "100%",
                                    height: "50px",
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                                disabled={isLoading}
                            >
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                    alt="Facebook Logo"
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                    }}
                                />
                                <span style={{ textAlign: "center", width: "100%" }}>Đăng nhập bằng Facebook</span>
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;

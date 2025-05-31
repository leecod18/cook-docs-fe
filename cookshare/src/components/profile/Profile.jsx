import React, { useState } from "react";
import { Container, Button, Nav, Tab, Row, Col, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const user = {
  displayName: localStorage.getItem("username") || "User",
  avatar: "https://www.redditstatic.com/avatars/avatar_default_02_24A0ED.png", // hoặc lấy từ backend nếu có
  userName: (localStorage.getItem("username") || "User"),
};

const tabs = [
  "Overview",
  "Posts",
  "Comments",
  "Saved",
  "Hidden",
  "Upvoted",
  "Downvoted",
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <Container style={{ maxWidth: 900, marginTop: 40 }}>
      <div className="d-flex align-items-center mb-4">
        <div style={{ position: "relative" }}>
          <Image
            src={user.avatar}
            roundedCircle
            style={{ width: 90, height: 90, border: "4px solid #fff", background: "#f6f7f8" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#fff",
              borderRadius: "50%",
              border: "1px solid #ccc",
              padding: 4,
              cursor: "pointer",
            }}
            title="Edit avatar"
          >
            <svg width="20" height="20" fill="#878a8c" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 0 0-2.828 0l-1.172 1.172 2.828 2.828 1.172-1.172a2 2 0 0 0 0-2.828zM2 13.586V18h4.414l9.293-9.293-2.828-2.828L2 13.586z"/>
            </svg>
          </span>
        </div>
        <div className="ms-4">
          <h2 style={{ fontWeight: 700 }}>{user.displayName}</h2>
          <div style={{ color: "#878a8c", fontSize: 18 }}>{user.userName}</div>
        </div>
      </div>
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-3">
          {tabs.map(tab => (
            <Nav.Item key={tab}>
              <Nav.Link eventKey={tab}>{tab}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <div className="d-flex align-items-center mb-4">
          <Button variant="outline-secondary" className="me-2">+ Create Post</Button>
          <span style={{ color: "#878a8c" }}>New</span>
        </div>
        <Tab.Content>
          <Tab.Pane eventKey="Overview">
            <div className="text-center mt-5">
              <img
                src="https://www.redditstatic.com/shreddit/assets/snoo-thinking.png"
                alt="No posts"
                style={{ width: 80, marginBottom: 16 }}
              />
              <div style={{ fontWeight: 600, fontSize: 22 }}>
                {user.userName} hasn't posted yet
              </div>
            </div>
          </Tab.Pane>
          {/* Các tab khác có thể để trống hoặc thêm nội dung tương tự */}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Profile; 
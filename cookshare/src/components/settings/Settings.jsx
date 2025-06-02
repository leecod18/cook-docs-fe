import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import './Settings.css';

const Settings = () => {
  return (
    <Container className="settings-container py-5">
      <h2 className="text-center mb-4">Account Settings</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="settings-card">
            <Card.Body>
              <Form>
                {/* Profile Section */}
                <div className="mb-4">
                  <h4>Profile Information</h4>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                </div>

                {/* Password Section */}
                <div className="mb-4">
                  <h4>Change Password</h4>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter current password" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm new password" />
                  </Form.Group>
                </div>

                {/* Notification Settings */}
                <div className="mb-4">
                  <h4>Notification Settings</h4>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      id="email-notifications"
                      label="Email Notifications"
                      defaultChecked
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      id="recipe-updates"
                      label="Recipe Updates"
                      defaultChecked
                    />
                  </Form.Group>
                </div>

                {/* Privacy Settings */}
                <div className="mb-4">
                  <h4>Privacy Settings</h4>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      id="profile-visibility"
                      label="Public Profile"
                      defaultChecked
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      id="show-email"
                      label="Show Email to Other Users"
                    />
                  </Form.Group>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings; 
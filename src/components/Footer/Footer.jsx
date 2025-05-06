import { Container } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <Container fluid="lg">
        <div className="footer-bottom py-3 border-top">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Tech Stack Roadmap Manager. All rights reserved.
            </p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
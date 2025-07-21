const Footer = () => {
  return (
    <footer className="py-3 bg-white border-top mt-auto">
      <div className="d-flex justify-content-center w-100">
        <span className="small text-muted">
          Copyright © Claim App {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;

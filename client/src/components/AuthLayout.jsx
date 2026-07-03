import { Link } from "react-router-dom";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          {title}
        </h1>

        <p className="text-gray-500 text-center mb-6">
          {subtitle}
        </p>

        {children}

        <div className="text-center mt-6">

          {footerText}

          <Link
            to={footerLink}
            className="text-blue-600 font-semibold ml-1"
          >
            {footerLinkText}
          </Link>

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;
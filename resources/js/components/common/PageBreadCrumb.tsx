import { Link } from "@inertiajs/react";

interface BreadcrumbProps {
  pageTitle: string;
  subTitle?: string;
  listBreadcrumb?: string[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, subTitle = '', listBreadcrumb = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex flex-col justify-center">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {pageTitle}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subTitle}
        </p>
      </div>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/dashboard"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          {listBreadcrumb.map((breadcrumb, index) => (
            <li key={index} className="text-sm text-gray-800 dark:text-white/90">
              {breadcrumb}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;

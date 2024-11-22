// components/common/PageContainer.jsx
export function PageContainer({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
        {/* SEO Heading */}
        <h1 className="sr-only">{`ACL Journey - ${title}`}</h1>

        {title && (
          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-darkb mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-silver_c text-sm md:text-base">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

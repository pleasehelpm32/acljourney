export default function CookiePolicyPage() {
  return (
    <main className="bg-background min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-cream rounded-3xl shadow-lg border-4 border-darkb/30 p-6 md:p-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-darkb mb-8">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-darkb/80">
              How We Use Cookies
            </p>
          </div>

          {/* Policy List */}
          <div className="space-y-6 mb-16">
            {/* What Are Cookies */}
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-darkb mt-3 shrink-0"></div>
              <p className="text-lg md:text-xl text-darkb/80 leading-relaxed">
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and analyzing how you
                use our site.
              </p>
            </div>

            {/* Types of Cookies */}
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-darkb mt-3 shrink-0"></div>
              <p className="text-lg md:text-xl text-darkb/80 leading-relaxed">
                We use{" "}
                <span className="font-semibold text-darkb">
                  essential cookies
                </span>{" "}
                to make our website work and{" "}
                <span className="font-semibold text-darkb">
                  analytics cookies
                </span>{" "}
                to understand how you use our site.
              </p>
            </div>

            {/* How We Use Them */}
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-darkb mt-3 shrink-0"></div>
              <p className="text-lg md:text-xl text-darkb/80 leading-relaxed">
                We use cookies to:
                <br />- Remember your preferences
                <br />- Analyze site traffic and usage
                <br />- Improve our services
                <br />- Enhance your browsing experience
              </p>
            </div>

            {/* Managing Cookies */}
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-darkb mt-3 shrink-0"></div>
              <p className="text-lg md:text-xl text-darkb/80 leading-relaxed">
                You can{" "}
                <span className="font-semibold text-darkb">
                  control and/or delete cookies
                </span>{" "}
                as you wish. You can delete all cookies that are already on your
                computer and set most browsers to prevent them from being
                placed.
              </p>
            </div>

            {/* Your Choices */}
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-darkb mt-3 shrink-0"></div>
              <p className="text-lg md:text-xl text-darkb/80 leading-relaxed">
                You can choose to{" "}
                <span className="font-semibold text-darkb">
                  accept or decline cookies
                </span>
                . While essential cookies are necessary for the website to
                function properly, you can opt out of analytics cookies at any
                time through our cookie consent banner.
              </p>
            </div>

            {/* Contact Information */}
            <div className="flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-darkb mt-3 shrink-0"></div>
              <p className="text-lg md:text-xl text-darkb/80 leading-relaxed">
                If you have any questions about our cookie policy, please
                contact us at{" "}
                <a
                  href="mailto:acljourneyjosh@gmail.com"
                  className="font-semibold text-darkb hover:text-black transition-colors"
                >
                  acljourneyjosh@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center">
            <p className="text-xl text-darkb/60">Last Updated: November 2024</p>
          </div>
        </div>
      </div>
    </main>
  );
}

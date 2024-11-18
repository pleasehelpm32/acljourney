import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-darkb/80">
      <div className="container mx-auto px-4 max-w-3xl py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <Link
              href="/policies"
              className="text-cream hover:text-white transition-colors"
            >
              Policies
            </Link>
            <a
              href="mailto:acljourneyjosh@gmail.com"
              className="flex items-center gap-2 text-cream hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>acljourneyjosh@gmail.com</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-cream/60 text-sm">
            <p>© 2024 ACL Journey. All rights reserved.</p>
            <p>Built by Josh 💪</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

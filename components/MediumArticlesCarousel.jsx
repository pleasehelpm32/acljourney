//components/MediumArticlesCarousel
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Newspaper,
  Loader2,
} from "lucide-react";

const MediumArticlesCarousel = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/medium-articles");
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const items = Array.from(xml.querySelectorAll("item"))
          .map((item) => {
            const titleElement = item.querySelector("title");
            const linkElement = item.querySelector("link");
            const contentElement =
              item.querySelector("content\\:encoded") ||
              item.querySelector("encoded");
            const pubDateElement = item.querySelector("pubDate");

            if (!titleElement?.textContent || !linkElement?.textContent) {
              return null;
            }

            // Extract a short excerpt from the content
            const excerpt =
              contentElement?.textContent
                .replace(/<!\[CDATA\[|\]\]>/g, "")
                .replace(/<[^>]*>/g, "")
                .slice(0, 150) + "...";

            return {
              title: titleElement.textContent
                .replace(/<!\[CDATA\[|\]\]>/g, "")
                .trim(),
              link: linkElement.textContent.trim(),
              excerpt: excerpt,
              pubDate: pubDateElement
                ? new Date(pubDateElement.textContent).toLocaleDateString()
                : "No date",
            };
          })
          .filter(Boolean);

        if (items.length === 0) {
          throw new Error("No valid articles found");
        }

        setArticles(items);
        setError(null);
      } catch (error) {
        console.error("Error fetching Medium articles:", error);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const nextArticle = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevArticle = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-darkb" />
      </div>
    );
  }

  if (error || !articles.length) {
    return (
      <Card className="p-6 border-silver_c/20">
        <p className="text-center text-silver_c">
          {error || "No articles available at the moment."}
        </p>
      </Card>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="space-y-4 mt-8">
      <Card className="overflow-hidden border-silver_c/20">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-silver_c">
                {currentArticle.pubDate}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevArticle}
                  className="p-2 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextArticle}
                  className="p-2 text-black hover:bg-silver_c hover:text-black border-silver_c/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <a
              href={currentArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-cream/50 rounded-lg p-4 md:p-6 space-y-4 group-hover:bg-silver_c/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Newspaper className="h-6 w-6 text-darkb" />
                  <h3 className="font-semibold text-base md:text-lg text-darkb group-hover:text-black transition-colors">
                    {currentArticle.title}
                  </h3>
                </div>

                <p className="text-sm md:text-base text-black/80 line-clamp-3">
                  {currentArticle.excerpt}
                </p>

                <div className="flex items-center text-sm text-silver_c group-hover:text-black transition-colors">
                  <span>Read on Medium</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-1 pt-2">
        {articles.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-4 bg-darkb" : "w-1.5 bg-silver_c/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MediumArticlesCarousel;

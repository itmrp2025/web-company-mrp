"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/layout/PageHero";
import { Button } from "@/components/custom-ui/Button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getApi } from "@/utils/helpers/getApi";
import { endpoints } from "@/utils/constants/endpoints.const";
import type { Article, ApiResponse } from "@/interface/admin.interface";

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "id" ? "id-ID" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

function parseDomNode(node: Node, index: number): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map((child, i) =>
      parseDomNode(child, i),
    );

    if (tagName === "p") {
      if (!el.textContent?.trim() && children.length === 0) return null;
      return (
        <p
          key={index}
          className="mb-4 text-neutral-700 leading-relaxed text-justify"
        >
          {children}
        </p>
      );
    }

    if (tagName === "h2") {
      return (
        <h2
          key={index}
          className="mt-10 mb-3 font-sans text-xl font-semibold text-neutral-900"
        >
          {children}
        </h2>
      );
    }

    if (tagName === "h3") {
      return (
        <h3
          key={index}
          className="mt-6 mb-2 font-sans text-lg font-semibold text-neutral-900"
        >
          {children}
        </h3>
      );
    }

    if (tagName === "blockquote") {
      const className =
        el.className ||
        "border-l-4 border-primary/40 pl-4 text-neutral-500 italic my-4 text-justify";
      return (
        <blockquote key={index} className={className}>
          {children}
        </blockquote>
      );
    }

    if (tagName === "ol") {
      const listItems = Array.from(el.querySelectorAll(":scope > li"));
      return (
        <ol key={index} className="mb-5 space-y-2 list-none">
          {listItems.map((li, j) => {
            const itemText = li.textContent || "";
            const [label, ...rest] = itemText.split(" — ");
            return (
              <li key={j} className="flex items-start gap-3 text-justify">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-[11px] font-bold text-white mt-0.5">
                  {j + 1}
                </span>
                <span className="text-neutral-700 leading-relaxed">
                  {rest.length > 0 ? (
                    <>
                      <strong className="text-neutral-900">{label}</strong> —{" "}
                      {rest.join(" — ")}
                    </>
                  ) : (
                    label
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      );
    }

    if (tagName === "ul") {
      const listItems = Array.from(el.querySelectorAll(":scope > li"));
      return (
        <ul key={index} className="mb-5 space-y-1.5">
          {listItems.map((li, j) => (
            <li
              key={j}
              className="flex items-start gap-2 text-neutral-700 text-justify"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
              {li.textContent}
            </li>
          ))}
        </ul>
      );
    }

    return <span key={index}>{children}</span>;
  }

  return null;
}

function renderContent(content: string) {
  if (typeof window === "undefined") return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const bodyNodes = Array.from(doc.body.childNodes);
    return bodyNodes.map((node, i) => parseDomNode(node, i));
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="mb-5 space-y-2 list-none">
          {items.map((item, j) => {
            const [label, ...rest] = item.split(" — ");
            return (
              <li key={j} className="flex items-start gap-3 text-justify">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-[11px] font-bold text-white mt-0.5">
                  {j + 1}
                </span>
                <span className="text-neutral-700 leading-relaxed">
                  {rest.length > 0 ? (
                    <>
                      <strong className="text-neutral-900">{label}</strong> —{" "}
                      {rest.join(" — ")}
                    </>
                  ) : (
                    label
                  )}
                </span>
              </li>
            );
          })}
        </ol>,
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="mb-5 space-y-1.5">
          {items.map((item, j) => (
            <li
              key={j}
              className="flex items-start gap-2 text-neutral-700 text-justify"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
              {item}
            </li>
          ))}
        </ul>,
      );
      continue;
    } else if (line.trim() !== "" && !line.match(/^[A-Z]/)) {
      elements.push(
        <p
          key={i}
          className="mb-4 text-neutral-700 leading-relaxed text-justify"
        >
          {line}
        </p>,
      );
    } else if (line.trim() !== "") {
      elements.push(
        <h2
          key={i}
          className="mt-10 mb-3 font-sans text-xl font-semibold text-neutral-900"
        >
          {line}
        </h2>,
      );
    }
    i++;
  }
  return elements;
}

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const locale = useLocale();
  const lang = locale as "id" | "en";
  const t = useTranslations("articles");

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(getApi(endpoints.articles.detail(params.slug)))
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ApiResponse<Article> | null) => {
        if (!data?.data || data.data.status !== "published") {
          setMissing(true);
        } else {
          setArticle(data.data);
        }
      })
      .catch(() => setMissing(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleCopy = (e: React.ClipboardEvent<HTMLElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === "") return;

    const copiedText = selection.toString();
    const currentUrl = window.location.href;
    const formattedText = `"${copiedText}"\n\nBagikan artikel ini ke teman anda : ${currentUrl}`;

    e.clipboardData.setData("text/plain", formattedText);
    e.preventDefault();
  };

  if (missing) notFound();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!article) return null;

  const title =
    lang === "id" ? article.content.title_id : article.content.title_en;
  const body =
    lang === "id" ? article.content.body_id : article.content.body_en;
  const catName = article.category
    ? lang === "id"
      ? article.category.content.id.name
      : article.category.content.en.name
    : "";

  return (
    <>
      <PageHero
        badge={catName || t("badge")}
        heading={title}
        imageUrl={
          article.featured_image ||
          "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1600&q=80&auto=format&fit=crop"
        }
        overlay="darker"
      />

      <section className="border-b border-neutral-100 bg-neutral-50 py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
            <Button
              variant="text"
              href="/articles"
              color="neutral"
              startIcon={<ArrowLeft className="h-4 w-4" />}
              className="text-neutral-400 hover:text-neutral-700 -ml-2"
            >
              {t("badge")}
            </Button>
            {article.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>{formatDate(article.published_at, locale)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{t("read_time")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="prose-custom text-justify" onCopy={handleCopy}>
            {renderContent(body)}
          </article>

          <div className="mt-14 border border-neutral-100 p-8">
            <h3 className="mb-2 font-sans text-lg font-semibold text-neutral-900">
              {t("consult_prompt")}
            </h3>
            <p className="mb-5 text-sm text-neutral-600">{t("consult_sub")}</p>
            <Button href="/contact">{t("consult_cta")}</Button>
          </div>
        </div>
      </section>
    </>
  );
}

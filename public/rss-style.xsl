<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:atom="http://www.w3.org/2005/Atom"
>

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="/rss/channel/title" /> - RSS Feed</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          :root {
            --page-bg: #f5f5f5;
            --bg-color: #ffffff;
            --text-color: #1a1a1a;
            --muted-color: rgba(26, 26, 26, 0.72);
            --border-color: rgba(26, 26, 26, 0.12);
            --link-color: #2563eb;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --page-bg: #0b0d12;
              --bg-color: #0f131a;
              --text-color: rgba(255, 255, 255, 0.92);
              --muted-color: rgba(255, 255, 255, 0.72);
              --border-color: rgba(255, 255, 255, 0.14);
              --link-color: #7aa2ff;
            }
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--page-bg);
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }

          .header {
            background: var(--bg-color);
            padding: 40px;
            margin-bottom: 30px;
            text-align: center;
          }

          .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            color: var(--text-color);
            line-height: 1.25;
          }

          .header p {
            color: var(--muted-color);
            font-size: 1.05em;
          }

          .posts {
            background: var(--bg-color);
            padding: 24px;
          }

          .posts h2 {
            font-size: 1.5em;
            margin-bottom: 16px;
            color: var(--text-color);
          }

          .post-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          /* PostCard-ish */
          .post-card {
            position: relative;
            border: 1px solid var(--border-color);
            padding: 1rem;
            border-radius: 8px;
            background-color: var(--bg-color);
            transition:
              background-color 0.3s,
              border-color 0.3s,
              transform 0.12s ease-in-out;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
          }

          .post-card:hover {
            border-color: rgba(127, 127, 127, 0.35);
            transform: translateY(-1px);
          }

          .post-card h3 {
            margin-bottom: 0.5rem;
            margin-top: 0;
            color: var(--text-color);
            font-size: 1.2rem;
            line-height: 1.35;
          }

          .post-card:hover h3 {
            color: var(--link-color);
          }

          .post-card p {
            color: var(--muted-color);
            margin-bottom: 0.75rem;
            line-height: 1.7;
          }

          .post-card:focus-visible {
            outline: 2px solid oklch(70.4% 0.191 22.216);
            outline-offset: 3px;
          }

          .dates {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .date-item {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            color: var(--muted-color);
            opacity: 0.9;
            font-size: 0.9em;
          }

          .date-item svg {
            width: 16px;
            height: 16px;
            flex: 0 0 auto;
          }

          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-bottom: 0.75rem;
          }

          .tag {
            display: inline-flex;
            align-items: center;
            padding: 0.15rem 0.5rem;
            border-radius: 999px;
            border: 1px solid var(--border-color);
            color: var(--muted-color);
            font-size: 0.85em;
            background: rgba(127, 127, 127, 0.08);
          }

          @media (max-width: 768px) {
            .container {
              padding: 10px;
            }

            .header {
              padding: 20px;
            }

            .header h1 {
              font-size: 1.6em;
            }

            .posts {
              padding: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1><xsl:value-of select="/rss/channel/title" /></h1>
            <p><xsl:value-of select="/rss/channel/description" /></p>
          </div>

          <div class="posts">
            <h2>最新文章（<xsl:value-of
                                select="count(/rss/channel/item)"
                            /> 篇）</h2>
            <div class="post-list">
              <xsl:apply-templates select="/rss/channel/item" />
            </div>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <a class="post-card">
      <xsl:attribute name="href">
        <xsl:value-of select="link" />
      </xsl:attribute>
      <xsl:attribute name="aria-label">
        <xsl:text>打开文章：</xsl:text>
        <xsl:value-of select="title" />
      </xsl:attribute>

      <h3>
        <xsl:value-of select="title" />
      </h3>

      <xsl:if test="category">
        <div class="tag-list">
          <xsl:for-each select="category">
            <span class="tag">
              <xsl:value-of select="." />
            </span>
          </xsl:for-each>
        </div>
      </xsl:if>

      <xsl:if test="description">
        <p>
          <xsl:value-of select="description" />
        </p>
      </xsl:if>

      <div class="dates">
        <xsl:if test="pubDate">
          <small class="date-item">
            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
              <g fill="none">
                <path
                                    fill="currentColor"
                                    d="M2 9c0-1.886 0-2.828.586-3.414S4.114 5 6 5h12c1.886 0 2.828 0 3.414.586S22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9m0 9c0 1.886 0 2.828.586 3.414S4.114 22 6 22h12c1.886 0 2.828 0 3.414-.586S22 19.886 22 18v-5c0-.471 0-.707-.146-.854C21.707 12 21.47 12 21 12H3c-.471 0-.707 0-.854.146C2 12.293 2 12.53 2 13z"
                                />
                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="2"
                                    d="M7 3v3m10-3v3"
                                />
              </g>
            </svg>
            <xsl:text>发布: </xsl:text>
            <xsl:value-of select="pubDate" />
          </small>
        </xsl:if>

        <xsl:if test="atom:updated">
          <small class="date-item">
            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
              <path
                                fill="currentColor"
                                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"
                            />
            </svg>
            <xsl:text>更新: </xsl:text>
            <xsl:value-of select="atom:updated" />
          </small>
        </xsl:if>
      </div>
    </a>
  </xsl:template>

</xsl:stylesheet>

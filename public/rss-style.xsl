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
            --page-bg: #f0f0f0;
            --bg-color: #ffffff;
            --text-color: #1a1a1a;
            --text-secondary: #666666;
            --border-color: #e0e0e0;
            --surface-color: #f5f5f5;
            --link-color: #1976d2;
            --radius-xs: 4px;
            --elevation-1: 0 1px 3px rgba(0,0,0,0.08);
            --elevation-2: 0 2px 8px rgba(0,0,0,0.06);
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --page-bg: #0d0d0d;
              --bg-color: #121212;
              --text-color: #e4e4e4;
              --text-secondary: #999999;
              --border-color: #333333;
              --surface-color: #1e1e1e;
              --link-color: #64b5f6;
            }
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--page-bg);
          }

          .container {
            max-width: 48rem;
            margin: 0 auto;
            padding: 1.5rem 1rem;
          }

          .header {
            background: var(--bg-color);
            border-bottom: 1px solid var(--border-color);
            padding: 2.5rem 1.5rem;
            text-align: center;
          }

          .header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--text-color);
            letter-spacing: -0.02em;
          }

          .header p {
            color: var(--text-secondary);
            font-size: 0.95rem;
          }

          .posts {
            margin-top: 1.5rem;
          }

          .posts h2 {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 0.75rem;
            padding: 0 0.25rem;
          }

          .post-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .post-card {
            display: block;
            border: 1px solid var(--border-color);
            padding: 1rem 1.25rem;
            border-radius: var(--radius-xs);
            background: var(--bg-color);
            box-shadow: var(--elevation-1);
            text-decoration: none;
            color: inherit;
            transition: box-shadow 0.2s, border-color 0.2s;
          }

          .post-card:hover {
            box-shadow: var(--elevation-2);
            border-color: var(--link-color);
          }

          .post-card h3 {
            font-size: 1.05rem;
            font-weight: 600;
            margin-bottom: 0.35rem;
            color: var(--text-color);
            line-height: 1.4;
          }

          .post-card:hover h3 {
            color: var(--link-color);
          }

          .post-card p {
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 0.5rem;
          }

          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.35rem;
            margin-bottom: 0.5rem;
          }

          .tag {
            display: inline-flex;
            align-items: center;
            padding: 0.15rem 0.5rem;
            border-radius: var(--radius-xs);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 0.8rem;
          }

          .dates {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .date-item {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            color: var(--text-secondary);
            font-size: 0.8rem;
            opacity: 0.8;
          }

          .date-item svg {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
          }

          @media (max-width: 480px) {
            .container {
              padding: 0.75rem 0.5rem;
            }

            .header {
              padding: 1.5rem 1rem;
            }

            .header h1 {
              font-size: 1.4rem;
            }

            .post-card {
              padding: 0.75rem 1rem;
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path fill="currentColor" d="M2 9c0-1.886 0-2.828.586-3.414S4.114 5 6 5h12c1.886 0 2.828 0 3.414.586S22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9m0 9c0 1.886 0 2.828.586 3.414S4.114 22 6 22h12c1.886 0 2.828 0 3.414-.586S22 19.886 22 18v-5c0-.471 0-.707-.146-.854C21.707 12 21.47 12 21 12H3c-.471 0-.707 0-.854.146C2 12.293 2 12.53 2 13z"/>
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 3v3m10-3v3"/>
              </g>
            </svg>
            <xsl:text>发布: </xsl:text>
            <xsl:value-of select="pubDate" />
          </small>
        </xsl:if>

        <xsl:if test="atom:updated">
          <small class="date-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/>
            </svg>
            <xsl:text>更新: </xsl:text>
            <xsl:value-of select="atom:updated" />
          </small>
        </xsl:if>
      </div>
    </a>
  </xsl:template>

</xsl:stylesheet>

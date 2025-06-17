import { marked } from "marked"

export const downloadAsPDF = async (content: string, filename = "larva-ai-notes") => {
  try {
    // Configure marked for better formatting
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
    })

    // Convert markdown to HTML
    const htmlContent = marked.parse(content)

    // Create a new window with the content
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 40px;
            }
            .header h1 {
              color: #2563eb;
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .header p {
              color: #6b7280;
              font-size: 16px;
            }
            .content {
              font-size: 16px;
              line-height: 1.8;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #1f2937;
              margin-top: 32px;
              margin-bottom: 16px;
              font-weight: 600;
            }
            h1 { 
              font-size: 32px; 
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
            }
            h2 { 
              font-size: 28px; 
              color: #2563eb;
            }
            h3 { 
              font-size: 24px; 
              color: #3b82f6;
            }
            h4 { font-size: 20px; }
            h5 { font-size: 18px; }
            h6 { font-size: 16px; }
            p {
              margin-bottom: 16px;
              text-align: justify;
            }
            pre {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              overflow-x: auto;
              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.5;
              margin: 20px 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            code {
              background: #f1f5f9;
              padding: 3px 6px;
              border-radius: 4px;
              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
              font-size: 14px;
              color: #dc2626;
              border: 1px solid #e2e8f0;
            }
            pre code {
              background: transparent;
              padding: 0;
              border: none;
              color: #374151;
            }
            blockquote {
              border-left: 4px solid #3b82f6;
              margin: 20px 0;
              padding: 16px 20px;
              background: #f8fafc;
              color: #4b5563;
              font-style: italic;
              border-radius: 0 8px 8px 0;
            }
            ul, ol {
              padding-left: 28px;
              margin-bottom: 16px;
            }
            li {
              margin-bottom: 8px;
              line-height: 1.6;
            }
            ul li {
              list-style-type: disc;
            }
            ol li {
              list-style-type: decimal;
            }
            strong {
              font-weight: 600;
              color: #1f2937;
            }
            em {
              font-style: italic;
              color: #4b5563;
            }
            a {
              color: #2563eb;
              text-decoration: underline;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            th {
              background: #f9fafb;
              font-weight: 600;
              color: #374151;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 20px;
              }
              .header {
                margin-bottom: 30px;
              }
              h1, h2, h3 {
                page-break-after: avoid;
              }
              pre {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🐛 Larva AI Study Notes</h1>
            <p>Generated on ${new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p>Generated by Larva AI - Your AI Study Assistant</p>
            <p>© ${new Date().getFullYear()} Larva AI. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(fullHtml)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Error generating PDF. Please try again.")
  }
}

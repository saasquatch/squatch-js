export interface ErrorTemplateOptions {
  rsCode?: string;
  apiErrorCode?: string;
  statusCode?: number;
  message?: string;
  mode?: string;
  style?: string;
}

export function getErrorTemplate(options: ErrorTemplateOptions = {}): string {
  const {
    rsCode,
    apiErrorCode,
    statusCode,
    message,
    mode = "modal",
    style = "",
  } = options;

  // Escape values using the browser's built-in HTML encoding
  const tmp = document.createElement("span");
  const esc = (s: string) => ((tmp.textContent = s), tmp.innerHTML);

  // Build error details items
  const detailItems: string[] = [];

  if (statusCode !== undefined) {
    detailItems.push(`<dt>Status Code</dt><dd>${esc(String(statusCode))}</dd>`);
  }
  if (apiErrorCode) {
    detailItems.push(`<dt>API Error Code</dt><dd>${esc(apiErrorCode)}</dd>`);
  }
  if (rsCode) {
    detailItems.push(`<dt>RS Code</dt><dd>${esc(rsCode)}</dd>`);
  }
  if (message) {
    detailItems.push(`<dt>Message</dt><dd>${esc(message)}</dd>`);
  }

  // Build the error details section
  const errorDetailsHtml =
    detailItems.length > 0
      ? `<dl class="error-details">${detailItems.join("\n            ")}</dl>`
      : "";

  return `<!DOCTYPE html>
    <!--[if IE 7]><html class="ie7 oldie" lang="en"><![endif]-->
    <!--[if IE 8]><html class="ie8 oldie" lang="en"><![endif]-->
    <!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
    <head>
      <style>
        ${style}
        body {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          line-height: 20px;
        }
        h3 {
          text-align: center;
        }
        .errortitle {
          margin: 0;
          font-size: 14px;
        }
        .errorbody p {
          text-align: center;
          font-size: 12px;
          margin: 0 0 10px;
        }
        h4 {
          font-size: 17.5px;
          text-align: center;
          margin: 10px 0;
        }
        .embed {
          width: 100%;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .errorbody {
          padding: 15px;
          position: relative;
          height: auto;
        }
        p {
          text-align: center;
          font-size: 12px;
        }
        .sadface {
          padding: 10px;
        }
        .sadface img {
          display: block;
          margin: auto;
          height: 100px;
        }
        .modal-disable-overlay {
          display: none;
          position: absolute;
          top: 50px;
          width: 100%;
          height: 85%;
          background: rgba(255, 255, 255, 0.4);
        }

        .right-align {
          text-align: right;
        }
        .errtxt {
          color: #CCC9C9;
        }
        .error-details {
          margin-top: 16px;
          padding: 12px;
          background: #f8f8f8;
          border-radius: 4px;
          text-align: left;
          font-size: 13px;
          color: #666;
          display: block;
          overflow: visible;
        }
        .error-details dt {
          display: block;
          font-weight: 600;
          color: #333;
          margin-top: 8px;
        }
        .error-details dt:first-child {
          margin-top: 0;
        }
        .error-details dd {
          display: block;
          margin: 4px 0 0 0;
          word-break: break-word;
        }
      </style>
    </head>
    <body>

      <div class="squatch-container ${mode}" style="width:100%">
        <div class="errorbody">
          <div class="sadface"><img src="https://res.cloudinary.com/saasquatch-staging/image/upload/v1774538373/whoops-error-image_km94z1.svg"></div>
          <h4>Our referral program is temporarily unavailable.</h4>
          <p>Please reload the page or check back later.</p>
          <p>If the problem persists please contact our support team.</p>

          ${errorDetailsHtml}
        </div>
      </div>
    </body>
    </html>`;
}

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
        .modal {
          width: 560px;
          background-color: #FFF;
          -webkit-border-radius: 6px;
          -webkit-background-clip: padding-box;
          -moz-border-radius: 6px;
          -moz-background-clip: padding;
          border-radius: 6px;
          background-clip: padding-box;
          -webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
          -moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
          box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 0, 0, 0.3);
          outline: none;
        }
        .embed {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }
        .embed .errorheader {
          display: none;
        }
        .embed .errorbody {
          max-width: 430px;
          margin-left: auto;
          margin-right: auto;
        }
        .errorheader {
          padding: 9px 15px;
          border-bottom: 1px solid #EEE;
        }
        .errorbody {
          padding: 15px;
          position: relative;
        }
        p {
          text-align: center;
          font-size: 12px;
        }
        .sadface {
          padding: 20px;
        }
        .sadface img {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .modal-disable-overlay {
          display: block;
          position: absolute;
          top: 50px;
          width: 100%;
          height: 85%;
          background: rgba(255, 255, 255, 0.4);
        }
        .close {
          float: right;
          font-size: 20px;
          font-weight: bold;
          line-height: 20px;
          color: #000;
          text-shadow: 0 1px 0 #FFF;
          opacity: 0.2;
        }
        button.close {
          padding: 0;
          cursor: pointer;
          background: rgba(0, 0, 0, 0);
          border: 0;
          -webkit-appearance: none;
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
        }
        .error-details dt {
          font-weight: 600;
          color: #333;
          margin-top: 8px;
        }
        .error-details dt:first-child {
          margin-top: 0;
        }
        .error-details dd {
          margin: 4px 0 0 0;
          word-break: break-word;
          font-family: monospace;
        }
        .error-details dd.message {
          font-family: inherit;
        }
      </style>
    </head>
    <body>

      <div class="squatch-container ${mode}" style="width:100%">
        <div class="errorheader">
          <button type="button" class="close" onclick="window.frameElement.squatchJsApi.close();">&times;</button>
          <p class="errortitle">Error</p>
        </div>
        <div class="errorbody">
          <div class="sadface"><img src="https://res.cloudinary.com/saasquatch-staging/image/upload/v1774538373/whoops-error-image_km94z1.svg"></div>
          <h4>Our referral program is temporarily unavailable.</h4>
          <p>Please reload the page or check back later.</p>
          <p>If the problem persists please contact our support team.</p>

          ${
            statusCode || apiErrorCode || rsCode || message
              ? `
          <dl class="error-details">
            ${statusCode ? `<dt>Status Code</dt><dd>${statusCode}</dd>` : ""}
            ${apiErrorCode ? `<dt>API Error Code</dt><dd>${apiErrorCode}</dd>` : ""}
            ${rsCode ? `<dt>RS Code</dt><dd>${rsCode}</dd>` : ""}
            ${message ? `<dt>Message</dt><dd class="message">${message}</dd>` : ""}
          </dl>
          `
              : ""
          }
        </div>
      </div>
    </body>
    </html>`;
}

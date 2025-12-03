interface SkeletonProps {
  height?: string | number;
  skeletonBackgroundColor?: string;
  skeletonShimmerColor?: string;
  borderColor?: string;
}

/**
 * Returns the complete HTML string (including <style>) for the skeleton.
 * Values are injected directly into the CSS string.
 */
export const getSkeleton = ({
  height = "500px",
  skeletonBackgroundColor = "#e0e0e0",
  skeletonShimmerColor = "#f5f5f5",
  borderColor = "#ccc",
}: SkeletonProps) => {
  // Normalize height to px if it's a number
  const heightVal = typeof height === "number" ? `${height}px` : height;

  return `
    <style>
        * {
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }

			.widget-container {
				background: white;
				width: 100%;
				max-width: 900px;
				padding: 40px;
				border-radius: 12px;
				box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
				box-sizing: border-box;
			}

			@keyframes shimmer {
				0% {
					background-position: -100% 0;
				}
				100% {
					background-position: 100% 0;
				}
			}

			.skeleton {
				background: ${skeletonBackgroundColor};
				background: linear-gradient(
					90deg,
					${skeletonBackgroundColor} 25%,
					${skeletonShimmerColor} 50%,
					${skeletonBackgroundColor} 75%
				);
				background-size: 200% 100%;
				animation: shimmer 1.5s infinite linear;
				border-radius: 6px;
				margin-bottom: 12px;
			}

			.sk-title-lg {
				height: 36px;
				width: 50%;
				margin-bottom: 16px;
			}
			.sk-title-md {
				height: 28px;
				width: 30%;
				margin-bottom: 20px;
				margin-top: 40px;
			}
			.sk-text {
				height: 16px;
				width: 80%;
				margin-bottom: 8px;
			}
			.sk-text-short {
				width: 40%;
			}
			.sk-label {
				height: 14px;
				width: 25%;
				margin-bottom: 10px;
			}

			.hero-section {
				display: flex;
				gap: 40px;
				margin-bottom: 40px;
				border-bottom: 1px solid ${borderColor};
				padding-bottom: 40px;
				flex-direction: row;
			}
			.hero-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.hero-image {
				flex: 1;
				height: 300px;
				border-radius: 12px;
			}

			.share-section {
				margin-bottom: 40px;
			}
			.sk-input {
				height: 50px;
				width: 100%;
				border-radius: 8px;
				margin-bottom: 16px;
			}
			.social-buttons {
				display: flex;
				gap: 12px;
			}
			.sk-btn-social {
				flex: 1;
				height: 50px;
				border-radius: 8px;
			}

			.stats-section {
				display: flex;
				gap: 24px;
				margin-bottom: 40px;
				padding: 30px 0;
				border-top: 1px solid ${borderColor};
				border-bottom: 1px solid ${borderColor};
			}
			.stat-card {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.stat-divider {
				padding-left: 24px;
			}

			.sk-stat-num {
				height: 48px;
				width: 120px;
				margin-bottom: 8px;
			}
			.sk-stat-label {
				height: 18px;
				width: 80px;
			}

			.table-header {
				display: flex;
				gap: 16px;
				margin-bottom: 16px;
			}
			.sk-th {
				height: 16px;
			}
			.table-row {
				display: flex;
				align-items: center;
				gap: 16px;
				padding: 16px 0;
				border-bottom: 1px solid ${borderColor};
			}

			.col-user {
				flex: 2;
			}
			.col-status {
				flex: 1;
			}
			.col-reward {
				flex: 2;
			}
			.col-date {
				flex: 1;
			}

			.sk-badge {
				height: 28px;
				width: 90px;
				border-radius: 14px;
			}
			.sk-reward-block {
				height: 36px;
				width: 100%;
				border-radius: 6px;
			}

			.pagination {
				display: flex;
				justify-content: flex-end;
				gap: 8px;
				margin-top: 24px;
			}
			.sk-btn-page {
				height: 36px;
				width: 64px;
				border-radius: 6px;
				margin-bottom: 0;
			}

			@media (max-width: 768px) {
				body {
					padding: 20px;
				}
				.widget-container {
					padding: 24px;
				}

				.hero-section {
					flex-direction: column-reverse;
					gap: 24px;
				}
				.hero-image {
					height: 220px;
					width: 100%;
				}
				.sk-title-lg {
					width: 80%;
				}

				.col-date {
					display: none;
				}
			}

			@media (max-width: 480px) {
				body {
					padding: 10px;
				}
				.widget-container {
					padding: 16px;
				}

				.sk-stat-num {
					width: 80px;
					height: 40px;
				}

				.col-reward {
					display: none;
				}

				.col-user {
					flex: 3;
				}
				.col-status {
					flex: 2;
					display: flex;
					justify-content: flex-end;
				}
			}
    </style>

    <div class="widget-container">
			<div class="hero-section">
				<div class="hero-content">
					<div class="skeleton sk-title-lg"></div>
					<div class="skeleton sk-text"></div>
					<div class="skeleton sk-text sk-text-short"></div>
				</div>
				<div class="skeleton hero-image"></div>
			</div>

			<div class="share-section">
				<div class="skeleton sk-label"></div>
				<div class="skeleton sk-input"></div>
				<div class="social-buttons">
					<div class="skeleton sk-btn-social"></div>
					<div class="skeleton sk-btn-social"></div>
					<div class="skeleton sk-btn-social"></div>
					<div class="skeleton sk-btn-social"></div>
				</div>
			</div>

			<div
				class="skeleton sk-title-md"
				style="margin-top: 0; width: 30%; margin-left: auto; margin-right: auto"
			></div>
			<div
				class="skeleton sk-text"
				style="width: 60%; margin-left: auto; margin-right: auto"
			></div>

			<div class="stats-section">
				<div class="stat-card">
					<div class="skeleton sk-stat-num"></div>
					<div class="skeleton sk-stat-label"></div>
				</div>
				<div class="stat-card stat-divider">
					<div class="skeleton sk-stat-num"></div>
					<div class="skeleton sk-stat-label"></div>
				</div>
			</div>

			<div class="skeleton sk-title-md"></div>

			<div class="table-header">
				<div class="skeleton sk-th col-user"></div>
				<div class="skeleton sk-th col-status"></div>
				<div class="skeleton sk-th col-reward"></div>
				<div class="skeleton sk-th col-date"></div>
			</div>

			<div class="table-row">
				<div class="col-user">
					<div class="skeleton sk-text" style="width: 70%; margin: 0"></div>
				</div>
				<div class="col-status">
					<div class="skeleton sk-badge" style="margin: 0"></div>
				</div>
				<div class="col-reward">
					<div class="skeleton sk-reward-block" style="margin: 0"></div>
				</div>
				<div class="col-date">
					<div class="skeleton sk-text" style="width: 80%; margin: 0"></div>
				</div>
			</div>
			<div class="table-row">
				<div class="col-user">
					<div class="skeleton sk-text" style="width: 60%; margin: 0"></div>
				</div>
				<div class="col-status">
					<div class="skeleton sk-badge" style="margin: 0"></div>
				</div>
				<div class="col-reward">
					<div class="skeleton sk-reward-block" style="margin: 0"></div>
				</div>
				<div class="col-date">
					<div class="skeleton sk-text" style="width: 80%; margin: 0"></div>
				</div>
			</div>
			<div class="table-row">
				<div class="col-user">
					<div class="skeleton sk-text" style="width: 75%; margin: 0"></div>
				</div>
				<div class="col-status">
					<div class="skeleton sk-badge" style="margin: 0"></div>
				</div>
				<div class="col-reward">
					<div class="skeleton sk-reward-block" style="margin: 0"></div>
				</div>
				<div class="col-date">
					<div class="skeleton sk-text" style="width: 80%; margin: 0"></div>
				</div>
			</div>

			<div class="pagination">
				<div class="skeleton sk-btn-page"></div>
				<div class="skeleton sk-btn-page"></div>
			</div>
		</div>
  `;
};

export type WidgetType = "referrer" | "instant-access";

interface SkeletonProps {
  type?: WidgetType;
  height?: string | number;
  skeletonBackgroundColor?: string;
  skeletonShimmerColor?: string;
}

/**
 * Returns the complete HTML string (including <style>) for the skeleton.
 * Values are injected directly into the CSS string.
 */
export const getSkeleton = ({
  type = "referrer",
  height = "500px",
  skeletonBackgroundColor = "#e0e0e0",
  skeletonShimmerColor = "#f5f5f5",
}: SkeletonProps) => {
  const referrerHTML = `
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

    <div class="skeleton sk-title-md" style="margin-top: 0; width: 30%; margin-left: auto; margin-right: auto"></div>
    <div class="skeleton sk-text" style="width: 60%; margin-left: auto; margin-right: auto"></div>

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
      <div class="col-user"><div class="skeleton sk-text" style="width: 70%; margin: 0"></div></div>
      <div class="col-status"><div class="skeleton sk-badge" style="margin: 0"></div></div>
      <div class="col-reward"><div class="skeleton sk-reward-block" style="margin: 0"></div></div>
      <div class="col-date"><div class="skeleton sk-text" style="width: 80%; margin: 0"></div></div>
    </div>
    
    <div class="table-row">
      <div class="col-user"><div class="skeleton sk-text" style="width: 60%; margin: 0"></div></div>
      <div class="col-status"><div class="skeleton sk-badge" style="margin: 0"></div></div>
      <div class="col-reward"><div class="skeleton sk-reward-block" style="margin: 0"></div></div>
      <div class="col-date"><div class="skeleton sk-text" style="width: 80%; margin: 0"></div></div>
    </div>

    <div class="table-row">
      <div class="col-user"><div class="skeleton sk-text" style="width: 75%; margin: 0"></div></div>
      <div class="col-status"><div class="skeleton sk-badge" style="margin: 0"></div></div>
      <div class="col-reward"><div class="skeleton sk-reward-block" style="margin: 0"></div></div>
      <div class="col-date"><div class="skeleton sk-text" style="width: 80%; margin: 0"></div></div>
    </div>

    <div class="pagination">
      <div class="skeleton sk-btn-page"></div>
      <div class="skeleton sk-btn-page"></div>
    </div>
  `;

  const instantAccessHTML = `
    <div class="hero-section instant-access-layout">
        <div class="skeleton hero-image ia-image"></div>
        
        <div class="hero-content ia-content">
          <div class="skeleton sk-title-lg ia-center"></div>
          <div class="skeleton sk-text ia-center"></div>
          
          <div class="skeleton sk-btn-action"></div>

           <div class="skeleton sk-label"></div>
           <div class="input-group">
             <div class="skeleton sk-input"></div>
             <div class="skeleton sk-btn-copy"></div>
           </div>

           <div class="skeleton sk-text-short ia-center" style="margin-top: 20px; width: 30%"></div>
           <div class="skeleton sk-text-short ia-center" style="width: 20%"></div>
        </div>
    </div>
  `;

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
        padding: 40px;
        box-sizing: border-box;
        overflow: hidden; 
      }

      @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 100% 0; }
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

      /* Typography Skeletons */
      .sk-title-lg { height: 36px; width: 80%; margin-bottom: 16px; }
      .sk-title-md { height: 28px; width: 30%; margin-bottom: 20px; margin-top: 40px; }
      .sk-text { height: 16px; width: 90%; margin-bottom: 8px; }
      .sk-text-short { width: 40%; }
      .sk-label { height: 14px; width: 25%; margin-bottom: 10px; }

      /* Layouts */
      .hero-section {
        display: flex;
        gap: 40px;
        margin-bottom: 40px;
        padding-bottom: 40px;
        flex-direction: row;
        height: 100%;
        /* Removed border-bottom */
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

      /* -- Specific Instant Access Overrides -- */
      .instant-access-layout {
         margin-bottom: 0;
         padding-bottom: 0;
         align-items: center; 
      }
      .ia-image {
         height: 400px; 
      }
      .ia-center {
         margin-left: auto;
         margin-right: auto;
      }
      .ia-content {
         align-items: center; 
         text-align: center;
      }
      .sk-btn-action {
         height: 45px;
         width: 140px;
         border-radius: 6px;
         margin: 24px auto;
      }
      .input-group {
         display: flex;
         gap: 10px;
         width: 100%;
         max-width: 400px;
      }
      .sk-btn-copy {
         height: 50px;
         width: 120px;
         border-radius: 8px;
      }
      /* ------------------------------------- */

      .share-section { margin-bottom: 40px; }
      .sk-input { height: 50px; width: 100%; border-radius: 8px; margin-bottom: 16px; }
      
      .social-buttons { display: flex; gap: 12px; }
      .sk-btn-social { flex: 1; height: 50px; border-radius: 8px; }

      .stats-section {
        display: flex;
        gap: 24px;
        margin-bottom: 40px;
        padding: 30px 0;
        /* Removed border-top and border-bottom */
      }
      .stat-card { flex: 1; display: flex; flex-direction: column; align-items: center; }
      .stat-divider { padding-left: 24px; }
      .sk-stat-num { height: 48px; width: 120px; margin-bottom: 8px; }
      .sk-stat-label { height: 18px; width: 80px; }

      /* Table Styles */
      .table-header { display: flex; gap: 16px; margin-bottom: 16px; }
      .sk-th { height: 16px; }
      .table-row { 
        display: flex; 
        align-items: center; 
        gap: 16px; 
        padding: 16px 0; 
        /* Removed border-bottom */
      }
      
      .col-user { flex: 2; }
      .col-status { flex: 1; }
      .col-reward { flex: 2; }
      .col-date { flex: 1; }

      .sk-badge { height: 28px; width: 90px; border-radius: 14px; }
      .sk-reward-block { height: 36px; width: 100%; border-radius: 6px; }

      .pagination { display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px; }
      .sk-btn-page { height: 36px; width: 64px; border-radius: 6px; margin-bottom: 0; }

      @media (max-width: 768px) {
        body { padding: 20px; }
        .widget-container { padding: 24px; }

        .hero-section { flex-direction: column-reverse; gap: 24px; }
        .instant-access-layout { flex-direction: column; }
        
        .hero-image { height: 220px; width: 100%; }
        .sk-title-lg { width: 100%; }

        .col-date { display: none; }
      }
    </style>

    <div class="widget-container">
      ${type === "referrer" ? referrerHTML : instantAccessHTML}
    </div>
  `;
};

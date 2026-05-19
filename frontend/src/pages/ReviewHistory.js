import React, { useState, useEffect } from "react";

function ReviewHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("sentiment_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing history:", err);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("sentiment_history");
    setHistory([]);
  };

  return (
    <div className="page" style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "15px", background: "linear-gradient(90deg, #00f5ff, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        📝 Review History
      </h1>
      <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "40px" }}>
        Here are the last 5 sentiment analysis inputs and results from the Chatbot.
      </p>

      {history.length === 0 ? (
        <div className="result-box" style={{ padding: "40px", borderRadius: "20px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "inline-block", maxWidth: "600px", textAlign: "center" }}>
          <h3 style={{ fontSize: "22px", color: "#64748b", margin: "0 0 10px 0" }}>No history found</h3>
          <p style={{ fontSize: "16px", color: "#475569", margin: 0 }}>
            Go to the Chatbot page and analyze some product reviews to see them show up here dynamically!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "25px" }}>
          <div 
            className="result-box"
            style={{
              width: "100%",
              overflowX: "auto",
              padding: "24px 30px",
              borderRadius: "24px",
              background: "rgba(4, 6, 20, 0.6)",
              border: "1px solid rgba(0, 245, 255, 0.15)",
              boxShadow: "0 8px 32px var(--glass-glow)",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0, 245, 255, 0.2) transparent",
            }}
          >
            {/* Single Line dynamic display */}
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "16px", 
                whiteSpace: "nowrap", 
                minWidth: "max-content",
                padding: "8px 0"
              }}
            >
              {history.map((item, index) => {
                const isPositive = item.prediction === "Positive";
                const badgeColor = isPositive ? "#10b981" : "#f43f5e";
                const badgeBg = isPositive ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)";
                
                return (
                  <React.Fragment key={item.id || index}>
                    {index > 0 && (
                      <span style={{ color: "rgba(255, 255, 255, 0.15)", fontSize: "20px", fontWeight: "300", userSelect: "none" }}>
                        •
                      </span>
                    )}
                    <div 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "10px", 
                        background: "rgba(255, 255, 255, 0.03)", 
                        border: "1px solid rgba(255, 255, 255, 0.06)", 
                        borderRadius: "16px", 
                        padding: "10px 18px", 
                        transition: "all 0.3s ease",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(0, 245, 255, 0.3)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      }}
                    >
                      <span 
                        style={{ 
                          fontSize: "14px", 
                          color: "#94a3b8", 
                          maxWidth: "150px", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          display: "inline-block" 
                        }}
                        title={item.review}
                      >
                        "{item.review}"
                      </span>
                      <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>→</span>
                      <span 
                        style={{ 
                          fontSize: "13px", 
                          fontWeight: "700", 
                          color: badgeColor, 
                          backgroundColor: badgeBg, 
                          border: `1px solid ${badgeColor}33`,
                          padding: "4px 10px", 
                          borderRadius: "10px",
                          letterSpacing: "0.03em"
                        }}
                      >
                        {item.prediction.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
                        {item.confidence ? `${Math.round(item.confidence * 100)}%` : ""}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <button 
            onClick={clearHistory}
            style={{ 
              background: "rgba(244, 63, 94, 0.05)",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              color: "#f43f5e",
              borderRadius: "14px",
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              width: "auto",
              marginTop: "10px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
              e.currentTarget.style.borderColor = "#f43f5e";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(244, 63, 94, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(244, 63, 94, 0.05)";
              e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Clear History Logs
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewHistory;
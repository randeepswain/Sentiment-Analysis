import React from "react";
import { motion } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { BarChart2, CheckCircle, Clock } from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Footer from "../components/Footer";

function Dashboard() {
  const data = [
    { name: "Positive Sentiment", value: 70 },
    { name: "Negative Sentiment", value: 20 },
    { name: "Neutral / Mixed", value: 10 }
  ];

  const COLORS = ["#10b981", "#f43f5e", "#f59e0b"];

  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "52px", fontWeight: "800", marginBottom: "15px" }}>
          AI Analytics Dashboard
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "20px" }}>
          Real-time customer satisfaction analytics compiled across trained model review streams.
        </p>
      </div>

      {/* Grid containing our premium animated cards */}
      <div 
        className="dashboard-cards"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "35px",
          marginTop: "40px",
          flexWrap: "wrap"
        }}
      >
        <DashboardCard 
          title="Total Analyzed" 
          value="1,200+" 
          subtitle="Processed Customer Reviews" 
          icon={BarChart2} 
          colorClass="cyan"
          delay={0.1}
        />
        <DashboardCard 
          title="Classifier Accuracy" 
          value="95.4%" 
          subtitle="Bayesian Class Confidence" 
          icon={CheckCircle} 
          colorClass="emerald"
          delay={0.2}
        />
        <DashboardCard 
          title="Average Inference" 
          value="12ms" 
          subtitle="Real-time Server Response" 
          icon={Clock} 
          colorClass="rose"
          delay={0.3}
        />
      </div>

      {/* Beautiful Glassmorphic Chart Section */}
      <motion.div 
        className="chart-box"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.4 }}
        style={{
          marginTop: "60px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: "40px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}
      >
        <h3 style={{ fontSize: "24px", color: "#fff", fontWeight: "600", marginBottom: "30px", textAlign: "left" }}>
          Aggregated Customer Sentiment Ratios
        </h3>

        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={70}
                paddingAngle={4}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                style={{ outline: "none" }}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontFamily: "Outfit, sans-serif"
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "16px", fontFamily: "Outfit" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      <Footer />
    </motion.div>
  );
}

export default Dashboard;